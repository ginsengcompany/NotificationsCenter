var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {

    var queryPostEvento = "SELECT A.matricola, A.nome, A.cognome, A.specializzazione, C.titolo, B._id_medico, B._id_evento, B.data_invio, B.tipo, B.stato, B.confermato, B.eliminato, B._id FROM tb_medici_iscritti A INNER JOIN tb_stato_notifiche B ON A._id=B._id_medico INNER JOIN tb_landing_evento C ON C._id=B._id_evento";

    var client = connectionPostgres();

    const query = client.query(queryPostEvento);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        var jsonFinale = {
            "data": final
        };

        client.end();
        return res.json(jsonFinale);

    });


});

module.exports = router;