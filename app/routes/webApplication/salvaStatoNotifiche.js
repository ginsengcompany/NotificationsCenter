var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var moment = require('moment');
var multiUser = require('../../../config/configMultiUser');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiStatoNotifica = req.body;

    var organizzazione = req.session.cod_org;

    var client = connectionPostgres();

    for(var i=0;i<multiUser.data.length;i++) {

        var multi = multiUser.data[i];

        if (multiUser.data[i].cod_org === organizzazione) {

            var queryPostStatoNotifica = "INSERT INTO "+multiUser.data[i].tb_notifiche+" " +
                "(_id_medico, _id_evento, stato, confermato, eliminato, data_invio,tipo)" +
                "VALUES (" +
                "'" + datiStatoNotifica.idMedico        +"', " +
                "'" + datiStatoNotifica.idEvento   +"', " +
                "'" + datiStatoNotifica.stato   +"', " +
                "'" + datiStatoNotifica.confermato   +"', " +
                "'" + datiStatoNotifica.eliminato   +"', " +
                "'" + moment(new Date()).format("01/01/1970")   +"', " +
                "'" + datiStatoNotifica.tipo   +"')";

            const query = client.query(queryPostStatoNotifica);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {

                var queryPostEliminatoConfermato1 = "SELECT * FROM "+multi.tb_notifiche+" WHERE eliminato=true AND confermato=false OR confermato=true AND _id_medico="+datiStatoNotifica.idMedico;

                const query = client.query(queryPostEliminatoConfermato1);

                query.on("row", function (row, result) {
                    result.addRow(row);
                });

                query.on("end", function (result) {
                    var myOjb = JSON.stringify(result.rows, null, "    ");
                    var final = JSON.parse(myOjb);



                    if(final.length>0){
                        var queryPostEliminatoConfermato = "UPDATE "+multi.tb_notifiche+" SET eliminato=false, confermato=false WHERE _id="+ final[0]._id;
                        const query = client.query(queryPostEliminatoConfermato);
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
                    else{
                        client.end();
                        return res.json({errore:true});
                    }


                });

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