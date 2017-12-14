var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiUpdateOrDelete = req.body;

    var client = connectionPostgres();

    if(datiUpdateOrDelete.action==='edit'){

        var queryUpdateOrDelete1 = "UPDATE tb_landing_evento SET " +
            "titolo='"+datiUpdateOrDelete.data[0].titolo+"', " +
            "sottotitolo='"+datiUpdateOrDelete.data[0].sottotitolo+"', " +
            "data='"+datiUpdateOrDelete.data[0].data+"', " +
            "luogo='"+datiUpdateOrDelete.data[0].luogo+"', " +
            "informazioni='"+datiUpdateOrDelete.data[0].informazioni+"', " +
            "relatori='"+datiUpdateOrDelete.data[0].relatori+"', " +
            "descrizione='"+datiUpdateOrDelete.data[0].descrizione+"', " +
            "data_fine='"+datiUpdateOrDelete.data[0].data_fine+"' " +
            "WHERE _id="+datiUpdateOrDelete.data[0]._id;

        const query = client.query(queryUpdateOrDelete1);

        query.on("row", function (row, result) {
            result.addRow(row);
        });

        query.on('error', function() {
            return res.json(false);
        });

        query.on("end", function (result) {
            var myOjb = JSON.stringify(result.rows, null, "    ");
            var final = JSON.parse(myOjb);
            return res.json(final);
            client.end();
        });

    }
    else if(datiUpdateOrDelete.action==='remove'){

        var queryUpdateOrDelete2 ="DELETE FROM tb_landing_evento WHERE _id_evento="+datiUpdateOrDelete.data._id;
        var queryUpdateOrDelete3 ="DELETE FROM tb_landing_evento WHERE _id="+datiUpdateOrDelete.data._id;

        const query = client.query(queryUpdateOrDelete2);

        query.on("row", function (row, result) {
            result.addRow(row);
        });

        query.on('error', function() {
            return res.json(false);
        });

        query.on("end", function (result) {

            const query = client.query(queryUpdateOrDelete3);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {
                return res.json(false);
            });

            query.on("end", function (result) {

                var myOjb = JSON.stringify(result.rows, null, "    ");
                var final = JSON.parse(myOjb);
                return res.json(final);
                client.end();

            });

        });

    }

});

module.exports = router;