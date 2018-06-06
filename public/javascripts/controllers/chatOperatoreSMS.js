$(document).ready(function() {

    setTimeout(function(){
        $('body').addClass('loaded');
        $('h1').css('color','#222222');
    }, 900);

    $("#ChatContainer").append("<ul class='pages' id='all-page'>\n" +
        "\n" +
        "    <li class='chat page' id='chat-page'>\n" +
        "      <div class='chatArea'>\n" +
        "        <ul class='messages'></ul>\n" +
        "      </div>\n" +
        "\n" +
        "      <input class='inputMessage' placeholder='Per favore inserisci un messaggio qui'/>\n" +
        "    </li>\n" +
        "\n" +
        "    <li class='login page' id='login-page'>\n" +
        "      <div class='form'>\n" +
        "        <h1 class='title'>Chat Notifications Center</h1>\n" +
        "        <h3 class='subtitle'>Per favore inserisci il tuo nickname</h3>\n" +
        "        <label>\n" +
        "          <input class='usernameInput' type='text' minlength='1' maxlength='50'\n" +
        "                 title='I nickname devono essere composti da 1 ~ 14 caratteri' autofocus/>\n" +
        "        </label>\n" +
        "      </div>\n" +
        "    </li>\n" +
        "\n" +
        "    <li class='room page' id='room-page'>\n" +
        "      <h1 class='room-title'>Lista delle stanze</h1>\n" +
        "      <h3 class='room-hint'>Fare clic sul blocco della stanza per unirsi</h3>\n" +
        "      <ul class='room-list'></ul>\n" +
        "    </li>\n" +
        "\n" +
        "  </ul>");
});


$(function() {

    let roomNameDynamic = document.getElementById('codOrg').textContent;

    let FADE_TIME = 150; // ms
    let TYPING_TIMER_LENGTH = 400; // ms
    let COLORS = [
        '#e21400', '#91580f', '#f8a700', '#f78b00',
        '#58dc00', '#287b00', '#008dff', '#4ae8c4',
        '#3b88eb', '#3824aa', '#a700ff', '#d300e7',
        '#CC9014', '#FF6C00', '#7900ff', '#14CC78',
        '#001bff', '#00b2d8', '#7900ff', '#00d877',
        '#4d7298', '#795da3', '#f47577', '#db324d',
        '#EE4035', '#F3A530', '#56B949', '#30499B',
        '#F3A530', '#56B949', '#844D9E', '#4e1c81'
    ];

    // Initialize variables
    let $window = $(window);
    let $usernameInput = $('.usernameInput'); // Input for username
    let $messages = $('.messages'); // Messages area
    let $inputMessage = $('.inputMessage'); // Input message input box

    let $loginPage = $('.login.page'); // login page
    let $chatPage = $('.chat.page'); // Chat room page
    let $roomPage = $('.room.page'); // Room list page
    let $roomList = $('.room-list'); // Room list <ul>
    let $btnTips = $('.btn-tips'); // Tool buttons

    // Prompt for setting a username
    let username;
    let connected = false;
    let typing = false;
    let lastTypingTime;
    let $currentInput = $usernameInput.focus();
    let $roomDiv;

    let socket = io();

    function addParticipantsMessage (data) {
        let message;
        if (!data.userJoinOrLeftRoom) {
            if (data.numUsers === 1) {
                message = 'Al momento, sei solo qui！';
            } else {
                message = 'Attualmente ci sono ' + data.numUsers + ' Ospiti in chat.';
            }
        }
        log(message);
    }

    // Sets the client's username
    function setUsername () {
        // If user name is input, get and then emit 'add user' event.
        // trim(): remove the whitespace from the beginning and end of a string.
        username = cleanInput($usernameInput.val().trim());

        // If the username is valid
        if (username) {
            $loginPage.fadeOut();
            $chatPage.show();
            $roomPage.fadeIn();
            $loginPage.off('click');
            $currentInput = $inputMessage.focus();

            // Tell the server your username
            socket.emit('add user', username);
        }
    }

    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {

    }
    else{
        $('.usernameInput').val('Amministratore');
        setUsername();
        $.ajax({
            url: '/getListaMessaggi',
            type: 'GET',
            cache: false,
            contentType: 'application/json',
            success: function (data) {
                let items = [];
                $.each(data, function(i, item) {

                    items.push('<li class="message" style="display: list-item;"><span class="username" style="color: rgb(20, 204, 120);">' + item.username + '</span><span class="messageBody"> ' + item.msg + '</span></li>');

                });  // close each()

                $('.messages').append( items.join('') );
            },
            faliure: function (data) {

            }
        });
    }


    // Sends a chat message.
    function sendMessage () {
        let message = $inputMessage.val();
        // Prevent markup from being injected into the message
        message = cleanInput(message);
        // if there is a non-empty message and a socket connection
        if (connected) {
            $inputMessage.val('');
            if (message.charAt(0) !== '/') {
                addChatMessage({
                    username: username,
                    message: message
                });
                // tell server to execute 'new message' and send along one parameter
                socket.emit('new message', message);

                let datiMessaggi = {
                    "username" : username,
                    "msg" : message
                };

                $.ajax({
                    url: '/insertMessageChat',
                    type: 'POST',
                    data: JSON.stringify(datiMessaggi),
                    cache: false,
                    contentType: 'application/json',
                    success: function (data) {

                    },
                    faliure: function (data) {

                    }
                });

                // If input a command with '/'.
            } else {
                inputCommand(message);
            }
        }
    }

    socket.emit('join room', roomNameDynamic);

    // Log a message
    function log (message, options) {
        options = options || {};
        let $logDiv;

        if (typeof options.userConnEvent !== 'undefined') {
            let userName = options.username;
            let colorOfUserName = getUsernameColor(userName);
            let $usernameDiv = $('<span class="username">')
                .text(userName)
                .css('color', colorOfUserName);
            // var $logBodyDiv = $('<span>').text(message);
            $logDiv = $('<li>')
                .addClass('log')
                .append($usernameDiv, message);
            addMessageElement($logDiv, options);
        } else {
            $logDiv = $('<li>').addClass('log').text(message);
            addMessageElement($logDiv, options);
        }
    }

    // Adds the visual chat message to the message list
    function addChatMessage (data, options) {
        // Don't fade the message in if there is an 'X was typing'
        let $typingMessages = getTypingMessages(data);
        options = options || {};
        if ($typingMessages.length !== 0) {
            options.fade = false;
            $typingMessages.remove();
        }

        let userName = data.username;
        let colorOfUserName = getUsernameColor(userName);
        if (data.typing !== true) {
            userName += ': ';
        }
        if (data.message !== ''){
            let $usernameDiv = $('<span class="username"/>')
                .text(userName)
                .css('color', colorOfUserName);
            let $messageBodyDiv = $('<span class="messageBody">')
                .text(data.message);

            let typingClass = data.typing ? 'typing' : '';
            let $messageDiv = $('<li class="message"/>')
                .data('username', userName)
                .addClass(typingClass)
                .append($usernameDiv, $messageBodyDiv);

            addMessageElement($messageDiv, options);
        }
    }

    // Adds the visual chat typing message
    function addChatTyping (data) {
        data.typing = true;
        data.message = 'Sta Scrivendo...';
        addChatMessage(data);
    }

    // Removes the visual chat typing message
    function removeChatTyping (data) {
        getTypingMessages(data).fadeOut(function () {
            $(this).remove();
        });
    }

    // Adds a message element to the messages and scrolls to the bottom
    // el - The element to add as a message
    // options.fade - If the element should fade-in (default = true)
    // options.prepend - If the element should prepend
    //   all other messages (default = false)
    function addMessageElement (el, options) {
        let $el = $(el);

        // Setup default options
        if (!options) {
            options = {};
        }
        if (typeof options.fade === 'undefined') {
            options.fade = true;
        }
        if (typeof options.prepend === 'undefined') {
            options.prepend = false;
        }

        // Apply options
        if (options.fade) {
            $el.hide().fadeIn(FADE_TIME);
        }
        if (options.prepend) {
            $messages.prepend($el);
        } else {
            $messages.append($el);
        }
        // When sending message, make screen to last message (here is bottom).
        //noinspection JSUnresolvedVariable
        $messages[0].scrollTop = $messages[0].scrollHeight;
    }

    // Prevents input from having injected markup
    function cleanInput (input) {
        return $('<div/>').text(input).text();
    }

    // Updates the typing event
    function updateTyping () {
        if (connected) {
            if (!typing) {
                typing = true;
                socket.emit('typing');
            }
            lastTypingTime = (new Date()).getTime();

            setTimeout(function () {
                let typingTimer = (new Date()).getTime();
                let timeDiff = typingTimer - lastTypingTime;
                if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
                    socket.emit('stop typing');
                    typing = false;
                }
            }, TYPING_TIMER_LENGTH);
        }
    }

    // Gets the 'X is typing' messages of a user
    function getTypingMessages (data) {
        return $('.typing.message').filter(function () {
            return $(this).data('username') === data.username;
        });
    }

    // Gets the color of a username.
    function getUsernameColor (username) {
        let eachCharCode = 0;
        let randIndex;
        for (var ii = 0; ii < username.length; ii++) {
            eachCharCode += username.charCodeAt(ii);
        }
        randIndex = Math.abs(eachCharCode % COLORS.length);
        return COLORS[randIndex];
    }

    // Keyboard events

    $window.keydown(function (event) {
        // Auto-focus the current input when a key is typed
        //noinspection JSUnresolvedVariable
        if (!(event.ctrlKey || event.metaKey || event.altKey)) {
            $currentInput.focus();
        }
        // When the client hits ENTER on their keyboard
        if (event.which === 13) {
            if (username) {
                sendMessage();
                socket.emit('stop typing');
                typing = false;
            } else {
                setUsername();
            }
        }
    });

    $inputMessage.on('input', function() {
        updateTyping();
    });

    // Click events

    // Focus input when clicking anywhere on login page
    $loginPage.click(function () {
        $currentInput.focus();
    });

    // Focus input when clicking on the message input's border
    $inputMessage.click(function () {
        $inputMessage.focus();
    });

    // Socket events

    // Whenever the server emits 'login', log the login message
    socket.on('login', function (data) {
        connected = true;
        // Display the welcome message
        let message = '● Benvenuto in Chat Notifications Center ●';
        log(message, {
            prepend: true
        });
        addParticipantsMessage(data);
    });

    // Whenever the server emits 'new message', update the chat body
    socket.on('new message', function (data) {
        addChatMessage(data);
    });

    // Whenever the server emits 'user joined', log it in the chat body
    socket.on('user joined', function (data) {
        log(data.logAction + data.logLocation + data.roomName, {
            userConnEvent: true,
            username: data.username
        });
        addParticipantsMessage(data);
        socket.emit('room list');
    });

    // Whenever the server emits 'user left', log it in the chat body
    socket.on('user left', function (data) {
        log(data.logAction + data.logLocation + data.roomName, {
            userConnEvent: true,
            username: data.username
        });
        addParticipantsMessage(data);
        removeChatTyping(data);
        // Reload room list.
        socket.emit('room list');
    });

    // Whenever the server emits 'typing', show the typing message
    socket.on('typing', function (data) {
        addChatTyping(data);
    });

    // Whenever the server emits 'stop typing', kill the typing message
    socket.on('stop typing', function (data) {
        removeChatTyping(data);
    });

    socket.on('disconnect', function () {
        log('Hai interrotto la connessione');
        // Reload room list.
        socket.emit('room list');
    });

    socket.on('reconnect', function () {
        log('Ti sei ricollegato');
        if (username) {
            socket.emit('add user', username);
            // Reload room list.
            socket.emit('room list');
        }
    });

    socket.on('reconnect_error', function () {
        log('Riconnessione fallita...');
    });

    // Show current room list.
    socket.on('show room list', function (room, rooms) {
        $roomList.empty();
        let roomClassName = room.trim().toLowerCase().replace(/\s/g,'');

        $.each(rooms, function (roomName, numUserInRoom) {
            // Set class name of room's <div> to be clear.
            let className = roomName.trim().toLowerCase().replace(/\s/g,'');
            $roomDiv = $('<div class="room"></div>')
                .html('<b>' + roomName + '</b>'
                    + '<span class="user-number-in-room">'
                    + '(' + numUserInRoom + ' persone' + ')' + '</span>')
                .addClass(className)
                .click(function () {
                    socket.emit('join room', roomName);
                    $inputMessage.focus();
                });
            $roomList.append($roomDiv);
        });

        $('.' + roomClassName).addClass('joined-room');
    });

    socket.on('join left result', function (data) {
        // log results.
        log(data.username + data.logAction
            + data.logLocation + data.roomName, {});
    });

    // Every 30 secs. reload current room list.
    setInterval(function () {
        socket.emit('room list');
    }, 30000);


    // jQuery UI Style
    $roomList.sortable();
    $btnTips.tooltip();
    $btnTips.on( "click", function() {
        $('#effect-tips').toggle('blind');
    });
});


