var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');
var multiUser = require('../../config/configMultiUser');

var connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {

    var confermato = req.query.confermato;
    var eliminato = req.query.eliminato;
    var idMedico = req.query.idMedico;
    var idEvento = req.query.idEvento;

    var organizzazione = req.session.cod_org;

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            var queryPostConfermato = '';

            queryPostConfermato = "UPDATE "+multiUser.data[i].tb_notifiche+" SET confermato='"+confermato+"', eliminato='"+eliminato+"' WHERE _id_medico='"+ idMedico +"' AND _id_evento='"+idEvento+"'";


            var client = connectionPostgres();

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
                if(confermato==='true'){

                    return res.redirect('/partecipato');
                }
                if(eliminato==='true'){

                    return res.redirect('/declinato');
                }
                res.json({errore:false});
                client.end();
            });

        }
    }

});

module.exports = router;