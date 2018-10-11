let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let datiEvento = req.body;

    function replaceAll (search, replacement, string) {
        let target = string;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostEvento = "INSERT INTO "+multiUser.data[i].tb_eventi+" " +
                "(titolo, sottotitolo, descrizione, url_evento, tipo)" +
                "VALUES (" +
                "'" + replaceAll("'", "`",datiEvento.titolo)  +"', " +
                "'" + replaceAll("'", "`",datiEvento.sottotitolo) +"', " +
                "'" + replaceAll("'", "`",datiEvento.descrizione)    +"', " +
                "'" + replaceAll("'", "`",datiEvento.url_evento)    +"', " +
                "" + datiEvento.tipo  +")";

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


});

module.exports = router;