let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    function replaceAll (search, replacement, string) {
        let target = string;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    let datiUpdateOrDelete = req.body;

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            if(datiUpdateOrDelete.data.length===10 && datiUpdateOrDelete.dataFine.length===10){

                let dd1 = datiUpdateOrDelete.data.substr(0,2);
                let mm1 = datiUpdateOrDelete.data.substr(3,2);
                let yy1 = datiUpdateOrDelete.data.substr(6,10);
                let dd2 = datiUpdateOrDelete.dataFine.substr(0,2);
                let mm2 = datiUpdateOrDelete.dataFine.substr(3,2);
                let yy2 = datiUpdateOrDelete.dataFine.substr(6,10);
                let data_inizio = yy1+'-'+mm1+'-'+dd1;
                let data_fine = yy2+'-'+mm2+'-'+dd2;

                let queryUpdateOrDelete1 =
                    "UPDATE "+multiUser.data[i].tb_eventi+" SET " +
                    "titolo='" + datiUpdateOrDelete.titolo + "', " +
                    "sottotitolo='" + datiUpdateOrDelete.sottotitolo + "', " +
                    "data='" + moment(data_inizio).format() + "', " +
                    "luogo='" + datiUpdateOrDelete.luogo + "', " +
                    "informazioni='" + datiUpdateOrDelete.informazioni + "', " +
                    "relatori='" + datiUpdateOrDelete.relatori + "', " +
                    "descrizione='" + datiUpdateOrDelete.descrizione + "', " +
                    "data_fine='" + moment(data_fine).format() + "', " +
                    "immagine='" + replaceAll("'", "`",datiUpdateOrDelete.immagine)  + "', " +
                    "url_evento='" + datiUpdateOrDelete.url_evento + "' " +
                    "WHERE _id=" + datiUpdateOrDelete._id;

                const query = client.query(queryUpdateOrDelete1);

                query.on("row", function (row, result) {
                    result.addRow(row);
                });

                query.on('error', function () {
                    client.end();
                    return res.json({errore:true});
                });

                query.on("end", function (result) {
                    let myOjb = JSON.stringify(result.rows, null, "    ");
                    let final = JSON.parse(myOjb);
                    client.end();
                    return res.json({errore:false});
                });

            }
            else {

                return res.json({errore:true});

            }

        }
    }

});

module.exports = router;