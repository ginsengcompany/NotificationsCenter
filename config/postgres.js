'use strict';
let config = require('./configPostgres');
let pg = require('pg');
let Pool = require('pg-pool');

let connectionString = config.protocol + '://' + config.username + ':' + config.password + '@' + config.ip + ':' + config.port + '/' + config.dbname;

function createConnectionPostgres(app){
    let pgClient = new pg.Client(connectionString);
    pgClient.connect();
    return pgClient;
}

module.exports = function(app) {
    return createConnectionPostgres(app);
};

