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

    var queryUpdateOrDelete1 =
        "UPDATE tb_landing_evento SET " +
        "titolo='" + datiUpdateOrDelete.titolo + "', " +
        "sottotitolo='" + datiUpdateOrDelete.sottotitolo + "', " +
        "data='" + datiUpdateOrDelete.data + "', " +
        "luogo='" + datiUpdateOrDelete.luogo + "', " +
        "informazioni='" + datiUpdateOrDelete.informazioni + "', " +
        "relatori='" + datiUpdateOrDelete.relatori + "', " +
        "descrizione='" + datiUpdateOrDelete.descrizione + "', " +
        "data_fine='" + datiUpdateOrDelete.data_fine + "' " +
        "WHERE _id=" + datiUpdateOrDelete._id;

    const query = client.query(queryUpdateOrDelete1);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function () {
        var final = {"Result": "Errore"};
        return res.json(final);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        //
        final = {"Result": "OK"};
        //
        return res.json(final);
        client.end();
    });
});

module.exports = router;