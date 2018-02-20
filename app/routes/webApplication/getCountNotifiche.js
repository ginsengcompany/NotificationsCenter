var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var moment = require('moment');
var multiUser = require('../../../config/configMultiUser');
var rr = require('rr');

var connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {



    var randomItem =rr (multiUser.data);

    var queryPostEvento = "select count(*) from "+randomItem.tb_notifiche+" where stato=false";

    var client = connectionPostgres();

    const query = client.query(queryPostEvento);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb)[0];
        final.tb_notifiche = randomItem.tb_notifiche;
        final.tb_eventi = randomItem.tb_eventi;
        final.tb_contatti = randomItem.tb_contatti;
        final.descrizione = randomItem.descrizione;

        client.end();
        return res.json(final);

    });


});

module.exports = router;