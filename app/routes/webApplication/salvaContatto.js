let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    // Dati del contatto da salvare che vengono passati dalla richiesta
    let datiContatto = req.body;

    // Il codice organizzazione viene passato all'interno della sessione
    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostContatto = "INSERT INTO "+multiUser.data[i].tb_contatti+" " +
                "(nome, cognome, specializzazione, provincia, mail, username, password, numero_telefono, interessi, pec)" +
                "VALUES (" +
                "'" + datiContatto.nome                                 +"', " +
                "'" + datiContatto.cognome                              +"', " +
                "'" + datiContatto.specializzazione                     +"', " +
                "'" + datiContatto.provincia                            +"', " +
                "'" + datiContatto.mail                                 +"', " +
                "'" + organizzazione + '-' + datiContatto.username      +"', " + // la username viene sempre preceduta dal codice organizzazione
                "'" + datiContatto.password                             +"', " +
                "'" + datiContatto.numero_telefono                      +"', " +
                "'" + datiContatto.interesse                            +"', " +
                "'" + datiContatto.pec                                  +"')";

            const query = client.query(queryPostContatto);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {
                return res.json(false);
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