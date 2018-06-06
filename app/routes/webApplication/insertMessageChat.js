let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    let datiMessaggi = req.body;

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            if(datiMessaggi.msg === 'Sta Scrivendo...'){
                client.end();
                return res.json({errore:true});
            }else{
                let queryPostEvento = "INSERT INTO "+multiUser.data[i].tb_messaggi+" " +
                    "(username, msg, time)" +
                    "VALUES (" +
                    "'" + datiMessaggi.username  +"', " +
                    "'" + datiMessaggi.msg  +"', " +
                    "'" + moment().format()  +"')";

                const query = client.query(queryPostEvento);

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



        }
    }

});

module.exports = router;