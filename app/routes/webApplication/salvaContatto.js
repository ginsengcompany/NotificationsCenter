var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var moment = require('moment');
var multiUser = require('../../../config/configMultiUser');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiContatto = req.body;

    var organizzazione = req.session.cod_org;

    var client = connectionPostgres();

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            var queryPostContatto = "INSERT INTO "+multiUser.data[i].tb_contatti+" " +
                "(nome, cognome, specializzazione, provincia, mail, matricola, numero_telefono, pec)" +
                "VALUES (" +
                "'" + datiContatto.nome        +"', " +
                "'" + datiContatto.cognome   +"', " +
                "'" + datiContatto.specializzazione         +"', " +
                "'" + datiContatto.provincia  +"', " +
                "'" + datiContatto.mail      +"', " +
                "'" + datiContatto.matricola      +"', " +
                "'" + datiContatto.numero_telefono      +"', " +
                "'" + datiContatto.pec   +"')";

            const query = client.query(queryPostContatto);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                var myOjb = JSON.stringify(result.rows, null, "    ");
                var final = JSON.parse(myOjb);
                client.end();
                return res.json(final);
            });

        }
    }


});

module.exports = router;