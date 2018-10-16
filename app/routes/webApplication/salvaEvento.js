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
    let dd1 = datiEvento.data.substr(0,2);
    let mm1 = datiEvento.data.substr(3,2);
    let yy1 = datiEvento.data.substr(6,10);
    let dd2 = datiEvento.dataFine.substr(0,2);
    let mm2 = datiEvento.dataFine.substr(3,2);
    let yy2 = datiEvento.dataFine.substr(6,10);
    let data_inizio = yy1+'-'+mm1+'-'+dd1;
    let data_fine = yy2+'-'+mm2+'-'+dd2;
    let dataIni = moment(data_inizio).format();
    let dataFin = moment(data_fine).format();

    function replaceAll (search, replacement, string) {
        let target = string;
        return target.replace(new RegExp(search, 'g'), replacement);
    };

    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {
            if(datiEvento.immagine === undefined)
                datiEvento.immagine = '';
            if(datiEvento.url_evento === undefined)
                datiEvento.url_evento = '';
            let queryPostEvento = "INSERT INTO "+multiUser.data[i].tb_eventi+" " +
                "(titolo, sottotitolo, data, data_fine, luogo, informazioni, relatori, descrizione, tipo, immagine, url_evento)" +
                "VALUES (" +
                "'" + replaceAll("'", "`",datiEvento.titolo)  +"', " +
                "'" + replaceAll("'", "`",datiEvento.sottotitolo) +"', " +
                "'" + dataIni                  +"', " +
                "'" + dataFin                  +"', " +
                "'" + replaceAll("'", "`",datiEvento.luogo) +"', " +
                "'" + replaceAll("'", "`",datiEvento.informazioni)  +"', " +
                "'" + replaceAll("'", "`",datiEvento.relatori)    +"', " +
                "'" + replaceAll("'", "`",datiEvento.descrizione)    +"', " +
                "" + datiEvento.tipo  +", " +
                "'" + replaceAll("'", "`",datiEvento.immagine)   +"', " +
                "'" + replaceAll("'", "`",datiEvento.url_evento)  +  "')" ;

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