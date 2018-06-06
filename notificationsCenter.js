#!/usr/bin/env node

/**
 * Module dependencies.
 */

let  app = require('./serverApp');
let  debug = require('debug')('notificationsCenter:server');
let  http = require('http');

/**
 * Get port from environment and store in Express.
 */

let  port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */

let  server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

let io = require('socket.io')(server);
// Chat room

// Total number of users
let numUsers = 0;
// Current room list.
let curRoomList = {};

// Action: Create, Join, Left.
let logCreate = ' Già stabilito ';
let logJoin = ' È entrato ';
let logLeft = ' È uscito ';

// Location: Lab (main website, can be joined or left),
//           Room (can be created, joined, Left)
let logLab = 'Chat Notifications Center ';
let logRoom = 'Stanza';


io.on('connection', function (socket) {
    let addedUser = false;
    let curRoomName = 'Gruppo';

    // when the client emits 'new message', this listens and executes
    socket.on('new message', function (data) {
        // we tell the client to execute 'new message'
        socket.broadcast.to(curRoomName).emit('new message', {
            username: socket.username,
            message: data
        });
    });

    // when the client emits 'add user', this listens and executes
    socket.on('add user', function (username) {
        if (addedUser) return;

        // we store the username in the socket session for this client
        socket.username = username;
        ++numUsers;
        addedUser = true;
        // If there is no the same curRoomName in room list, add it to room list.
        // And set user number in it = 1, else user number + 1.
        if (!isRoomExist(curRoomName, curRoomList)) {
            curRoomList[curRoomName] = 1;
        } else {
            ++curRoomList[curRoomName];
        }

        // First join chat room, show current room list.
        socket.emit('show room list', curRoomName, curRoomList);

        socket.emit('login', {
            numUsers: numUsers
        });

        // echo to room (default as 'Lobby') that a person has connected
        socket.broadcast.emit('user joined', {
            username: socket.username,
            numUsers: numUsers,
            logAction: logJoin,
            logLocation: logLab,
            roomName: '',
            userJoinOrLeftRoom: false
        });
    });

    // when the client emits 'typing', we broadcast it to others
    socket.on('typing', function () {
        socket.broadcast.to(curRoomName).emit('typing', {
            username: socket.username
        });
    });

    // when the client emits 'stop typing', we broadcast it to others
    socket.on('stop typing', function () {
        socket.broadcast.emit('stop typing', {
            username: socket.username
        });
    });

    // when the user disconnects, perform this
    socket.on('disconnect', function () {
        if (addedUser) {
            --numUsers;
            --curRoomList[curRoomName];

            // If there is no user in room, delete this room,
            // Except this room is 'Lobby'.
            if (curRoomList[curRoomName] === 0 && curRoomName !== 'Gruppo') {
                delete curRoomList[curRoomName];
            }

            if (numUsers === 0) {
                curRoomList = {};
            }
            // echo globally that this client has left
            socket.broadcast.emit('user left', {
                username: socket.username,
                numUsers: numUsers,
                logAction: logLeft,
                logLocation: logLab,
                roomName: ''
            });
        }
    });

    // Show room list to user.
    socket.on('room list', function () {
        socket.emit('show room list', curRoomName, curRoomList);
    });

    socket.on('join room', function (room) {
        socket.emit('stop typing');

        if (room !== curRoomName) {
            // Before join room, first need to leave current room. -------------------
            socket.leave(curRoomName);
            socket.broadcast.to(curRoomName).emit('user left', {
                username: socket.username,
                numUsers: numUsers,
                logAction: logLeft,
                logLocation: logRoom,
                roomName: ' [' + curRoomName + '] ',
                userJoinOrLeftRoom: true
            });
            --curRoomList[curRoomName];

            // If there is no user in room, delete this room,
            // Except this room is 'Lobby'.
            if (curRoomList[curRoomName] === 0 && curRoomName !== 'Gruppo') {
                delete curRoomList[curRoomName];
            }

            // Then join a new room. -------------------------------------------------
            socket.join(room);

            // If there is no the same room in room list, add it to room list.
            if (!isRoomExist(room, curRoomList)) {
                curRoomList[room] = 1;
                socket.emit('join left result', {
                    username: ' ',
                    logAction: logCreate,
                    logLocation: logRoom,
                    roomName: ' [' + room + '] '
                });
            } else {
                ++curRoomList[room];
                socket.emit('join left result', {
                    username: ' ',
                    logAction: logJoin,
                    logLocation: logRoom,
                    roomName: ' [' + room + '] '
                });
            }

            // Every time someone join a room, reload current room list.
            socket.emit('show room list', room, curRoomList);
            curRoomName = room;
            socket.broadcast.to(room).emit('user joined', {
                username: socket.username,
                numUsers: numUsers,
                logAction: logJoin,
                logLocation: logRoom,
                roomName: '[' + room + '] ',
                userJoinOrLeftRoom: true
            })
        }
    });

});

// Check if roomName is in roomList Object.
function isRoomExist (roomName, roomList) {
    return roomList[roomName] >= 0;
}

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  let  port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  let  bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let  addr = server.address();
  let  bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
