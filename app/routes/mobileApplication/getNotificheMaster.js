var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var moment = require('moment');
var multiUser = require('../../../config/configMultiUser');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    var organizzazione = req.body.organizzazione;

    var client = connectionPostgres();

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            var queryPostEvento = "SELECT A.matricola, A.nome, A.cognome, A.specializzazione, C.titolo, B._id_medico, B._id_evento, B.data_invio, B.tipo, B.stato, B.confermato, B.eliminato, B._id FROM "+multiUser.data[i].tb_contatti+" A INNER JOIN "+multiUser.data[i].tb_notifiche+" B ON A._id=B._id_medico INNER JOIN tb_landing_evento C ON C._id=B._id_evento";

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

        }
    }

});

module.exports = router;