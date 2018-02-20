var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var multiUser = require('../../../config/configMultiUser');


var connectionPostgres = function () {
    return postgresConnection();
};

router.options('/', function(req, res, next) {

    if (req.method === 'OPTIONS') {

        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Headers', 'authorization, content-type');

    }

    return res.json({errore:true});

});


router.post('/', function(req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', req.headers.origin);

    var organizzazione = req.body.organizzazione;
    var idEvento = req.body.id_evento;

    var client = connectionPostgres();

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            var queryPostEvento = "SELECT A.matricola, A.nome, A.cognome, A.specializzazione, B.data_invio, B.tipo FROM "+multiUser.data[i].tb_contatti+" A INNER JOIN "+multiUser.data[i].tb_notifiche+" B ON A._id=B._id_utente INNER JOIN tb_landing_evento C ON C._id=B._id_evento WHERE B._id_evento="+idEvento+" AND B.eliminato=true";

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