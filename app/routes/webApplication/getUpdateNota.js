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
                    "UPDATE "+multiUser.data[i].tb_eventi+" SET " +
                    "titolo='" + datiUpdateOrDelete.titolo + "', " +
                    "sottotitolo='" + datiUpdateOrDelete.sottotitolo + "', " +
                    "descrizione='" + datiUpdateOrDelete.descrizione + "', " +
                    "url_evento='" + datiUpdateOrDelete.url_evento + "' " +
                    "WHERE _id=" + datiUpdateOrDelete._id;

                const query = client.query(queryUpdateOrDelete1);

                query.on("row", function (row, result) {
                    result.addRow(row);
                });

                query.on('error', function () {
                    client.end();
                    return res.json({errore:queryUpdateOrDelete1});
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