var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var moment = require('moment');
var multiUser = require('../../../config/configMultiUser');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiEliminatoConfermato = req.body;
    var confermato = datiEliminatoConfermato.confermato;
    var eliminato = datiEliminatoConfermato.eliminato;
    var idUtente = datiEliminatoConfermato._id_utente;
    var idEvento = datiEliminatoConfermato._id_evento;

    var organizzazione = req.session.cod_org;

    var client = connectionPostgres();

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            var queryPostConfermato = '';

            queryPostConfermato = "UPDATE "+multiUser.data[i].tb_notifiche+" SET confermato='"+confermato+"', eliminato='"+eliminato+"' WHERE _id_utente='"+ idUtente +"' AND _id_evento='"+idEvento+"'";


            const query = client.query(queryPostConfermato);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {
                return res.json({errore:true});
            });

            query.on("end", function (result) {
                var myOjb = JSON.stringify(result.rows, null, "    ");
                var final = JSON.parse(myOjb);
                client.end();
                return res.json({errore:false});
            });

        }
    }

});

module.exports = router;