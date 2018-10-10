let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let multiUser = require('../../../config/configMultiUser');


let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let username = req.body.username;
    let password =  req.body.password;
    let mail = req.body.mail;
    let numero_telefono = req.body.numero_telefono;
    let pec = req.body.pec;
    let organizzazione = req.body.organizzazione;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++){

        if(multiUser.data[i].cod_org === organizzazione){

            let queryModificaInformazioni =
                "UPDATE "+multiUser.data[i].tb_contatti+" SET " +
                "mail='" + mail + "', " +
                "numero_telefono='" + numero_telefono + "', " +
                "pec='" + pec + "' " +
                "WHERE " +
                "username = '" + username + "' " +
                "AND " +
                "password = '" + password + "';";

            const query = client.query(queryModificaInformazioni);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on("error", function (err) {
                client.end();
                return res.send({status: false, messaggio: "Errore!", errore : err});
            });

            query.on("end", function (result) {
                let myOjb = JSON.stringify(result.rows, null, "    ");
                let final = JSON.parse(myOjb);
                client.end();
                return res.send({status: true});
            });
        }
    }
});

module.exports = router;