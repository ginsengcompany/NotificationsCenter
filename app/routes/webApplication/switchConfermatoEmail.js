let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let datiEliminatoConfermato = req.body;
    let confermato = datiEliminatoConfermato.confermato;
    let eliminato = datiEliminatoConfermato.eliminato;
    let idUtente = datiEliminatoConfermato._id_utente;
    let idEvento = datiEliminatoConfermato._id_evento;

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostConfermato = '';

            queryPostConfermato = "UPDATE "+multiUser.data[i].tb_notifiche+" SET confermato='"+confermato+"', eliminato='"+eliminato+"' WHERE _id_utente='"+ idUtente +"' AND _id_evento='"+idEvento+"'";


            const query = client.query(queryPostConfermato);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {
                return res.json({errore:true});
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