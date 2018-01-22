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
        "UPDATE tb_medici_iscritti SET " +
        "nome='" + datiUpdateOrDelete.nome + "', " +
        "cognome='" + datiUpdateOrDelete.cognome + "', " +
        "specializzazione='" + datiUpdateOrDelete.specializzazione + "', " +
        "provincia='" + datiUpdateOrDelete.provincia + "', " +
        "mail='" + datiUpdateOrDelete.mail + "', " +
        "matricola='" + datiUpdateOrDelete.matricola + "', " +
        "numero_telefono='" + datiUpdateOrDelete.telefono + "', " +
        "pec='" + datiUpdateOrDelete.pec + "' " +
        "WHERE _id=" + datiUpdateOrDelete._id;

    const query = client.query(queryUpdateOrDelete1);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function () {
        return res.json({errore:true});
        return res.json(final);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        //
        final = {"Result": "OK"};
        //
        return res.json({errore:false});
        client.end();
    });
});

module.exports = router;