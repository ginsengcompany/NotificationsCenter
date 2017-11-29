'use strict';
var config = require('./configPostgres');
var pg = require('pg');
var connectionString = config.dbpostgres.protocol + '://' + config.dbpostgres.username + ':' + config.dbpostgres.password + '@' + config.dbpostgres.ip + ':' + config.dbpostgres.port + '/' + config.dbpostgres.dbname;

function createConnectionPostgres(app){
    var pgClient = new pg.Client(connectionString);
    pgClient.connect();
    return pgClient;
}

module.exports = function(app) {
    return createConnectionPostgres(app);
};

