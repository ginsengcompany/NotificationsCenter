let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    let datiNotNotifica = req.body;

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostEvento = '';

            if(datiNotNotifica.interesse){
                queryPostEvento = "SELECT * from "+multiUser.data[i].tb_contatti+" A WHERE  NOT EXISTS (SELECT _id_utente FROM  "+multiUser.data[i].tb_notifiche+" B WHERE  A._id = B._id_utente AND B._id_evento='"+datiNotNotifica.idEvento+"') AND (numero_telefono <> '' OR numero_telefono <> null) AND interessi LIKE '%"+datiNotNotifica.interesse+"%' AND A.attivo = 'true'";
            }else{
                queryPostEvento = "SELECT * from "+multiUser.data[i].tb_contatti+" A WHERE  NOT EXISTS (SELECT _id_utente FROM  "+multiUser.data[i].tb_notifiche+" B WHERE  A._id = B._id_utente AND B._id_evento='"+datiNotNotifica.idEvento+"') AND (numero_telefono <> '' OR numero_telefono <> null) AND A.attivo = 'true'";
            }

            const query = client.query(queryPostEvento);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                let myOjb = JSON.stringify(result.rows, null, "    ");
                let final = JSON.parse(myOjb);
                let jsonFinale = {
                    "data": final
                };
                client.end();
                return res.json(jsonFinale);
            });

        }
    }

});

module.exports = router;