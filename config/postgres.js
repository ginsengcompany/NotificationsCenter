'use strict';
var config = require('./configPostgres');
var pg = require('pg');
var Pool = require('pg-pool');

var connectionString = config.protocol + '://' + config.username + ':' + config.password + '@' + config.ip + ':' + config.port + '/' + config.dbname;

function createConnectionPostgres(app){
    var pgClient = new pg.Client(connectionString);
    pgClient.connect();
    return pgClient;
}

module.exports = function(app) {
    return createConnectionPostgres(app);
};

