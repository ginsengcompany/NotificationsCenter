var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiContatto = req.body;

    var queryPostContatto = "INSERT INTO tb_medici_iscritti " +
        "(nome, cognome, specializzazione, provincia, mail, matricola, numero_telefono, pec)" +
        "VALUES (" +
        "'" + datiContatto.nome        +"', " +
        "'" + datiContatto.cognome   +"', " +
        "'" + datiContatto.specializzazione         +"', " +
        "'" + datiContatto.provincia  +"', " +
        "'" + datiContatto.mail      +"', " +
        "'" + datiContatto.matricola      +"', " +
        "'" + datiContatto.nuemro_telefono      +"', " +
        "'" + datiContatto.pec   +"')";

    var client = connectionPostgres();

    const query = client.query(queryPostContatto);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        return res.json(final);
        client.end();
    });
});

module.exports = router;