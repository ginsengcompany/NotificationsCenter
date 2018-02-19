var mysql = require('mysql');
var config = require('./configMySqlRIM');

var connection = mysql.createConnection({
    host     : config.dbMySql.host,
    user     : config.dbMySql.user,
    password : config.dbMySql.password,
    database : config.dbMySql.database
});

connection.connect(function(err){
    if(!err) {
        console.log("Database Connesso alla RIM... \n\n");
    } else {
        console.log("Errore connessione database alla RIM ... \n\n");
        connection.end();
    }
});



module.exports = connection;