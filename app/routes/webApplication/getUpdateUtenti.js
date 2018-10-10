let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    let datiUpdateOrDelete = req.body;

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryUpdateOrDelete1 =
                "UPDATE "+multiUser.data[i].tb_contatti+" SET " +
                "nome='" + datiUpdateOrDelete.nome + "', " +
                "cognome='" + datiUpdateOrDelete.cognome + "', " +
                "specializzazione='" + datiUpdateOrDelete.specializzazione + "', " +
                "provincia='" + datiUpdateOrDelete.provincia + "', " +
                "mail='" + datiUpdateOrDelete.mail + "', " +
                "username='" + datiUpdateOrDelete.username + "', " +
                "password='" + datiUpdateOrDelete.password + "', " +
                "interessi='" + datiUpdateOrDelete.interessi + "', " +
                "numero_telefono='" + datiUpdateOrDelete.telefono + "', " +
                "pec='" + datiUpdateOrDelete.pec + "', " +
                "attivo=" + datiUpdateOrDelete.attivo + " " +
                "WHERE _id=" + datiUpdateOrDelete._id;

            const query = client.query(queryUpdateOrDelete1);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function () {
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