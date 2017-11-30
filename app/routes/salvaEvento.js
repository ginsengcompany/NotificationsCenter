var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiEvento = req.body;
    var dataInizio = datiEvento.data.date;
    var dataIni = moment(dataInizio).format();

    var queryPostEvento = "INSERT INTO tb_landing_evento " +
        "(titolo, sottotitolo, data, luogo, informazioni, relatori, descrizione, immagine)" +
        "VALUES (" +
        "'" + datiEvento.titolo        +"', " +
        "'" + datiEvento.sottotitolo   +"', " +
        "'" + dataIni                  +"', " +
        "'" + datiEvento.luogo         +"', " +
        "'" + datiEvento.informazioni  +"', " +
        "'" + datiEvento.relatori      +"', " +
        "'" + datiEvento.descrizione      +"', " +
        "'" + datiEvento.immagine   +"')";

    var client = connectionPostgres();

    const query = client.query(queryPostEvento);

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