var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var multiUser = require('../../../config/configMultiUser');
var cron = require('node-cron');
var request = require('request');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var organizzazione = req.body.organizzazione;

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            cron.schedule('*!/1 * * * *', function(){


            });

        }
    }

});

module.exports = router;