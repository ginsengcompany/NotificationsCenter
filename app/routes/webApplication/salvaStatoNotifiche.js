let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let datiStatoNotifica = req.body;

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        let multi = multiUser.data[i];

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostStatoNotifica = "INSERT INTO "+multiUser.data[i].tb_notifiche+" " +
                "(_id_utente, _id_evento, stato, confermato, eliminato, data_invio, tipo, tipo_evento)" +
                "VALUES (" +
                "'" + datiStatoNotifica.idUtente        +"', " +
                "'" + datiStatoNotifica.idEvento   +"', " +
                "'" + datiStatoNotifica.stato   +"', " +
                "'" + datiStatoNotifica.confermato   +"', " +
                "'" + datiStatoNotifica.eliminato   +"', " +
                "'" + moment(new Date()).format("01/01/1970")   +"', " +
                "'" + datiStatoNotifica.tipo   +"', " +
                "" + datiStatoNotifica.tipoEvento   +")";

            const query = client.query(queryPostStatoNotifica);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {

                let queryPostEliminatoConfermato1 = "SELECT * FROM "+multi.tb_notifiche+" WHERE eliminato=true AND confermato=false OR confermato=true AND _id_utente="+datiStatoNotifica.idUtente;

                const query = client.query(queryPostEliminatoConfermato1);

                query.on("row", function (row, result) {
                    result.addRow(row);
                });

                query.on("end", function (result) {
                    let myOjb = JSON.stringify(result.rows, null, "    ");
                    let final = JSON.parse(myOjb);



                    if(final.length>0){
                        let queryPostEliminatoConfermato = "UPDATE "+multi.tb_notifiche+" SET eliminato=false, confermato=false WHERE _id="+ final[0]._id;
                        const query = client.query(queryPostEliminatoConfermato);
                        query.on("row", function (row, result) {
                            result.addRow(row);
                        });

                        query.on("end", function (result) {
                            let myOjb = JSON.stringify(result.rows, null, "    ");
                            let final = JSON.parse(myOjb);
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
                let myOjb = JSON.stringify(result.rows, null, "    ");
                let final = JSON.parse(myOjb);
                client.end();
                return res.json({errore:false});
            });

        }
    }

});

module.exports = router;