let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let multiUser = require('../../../config/configMultiUser');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let username = req.body.username;
    let token = req.body.token;
    let eliminato = req.body.eliminato;
    let organizzazione = req.body.organizzazione;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostEventyById =
                "SELECT B._id_utente, B._id_evento,C.url_evento, B.confermato, B.eliminato,C.titolo,C.sottotitolo,C.data,C.luogo,C.informazioni,C.relatori,C.descrizione,C.immagine,C.tipo FROM "
                + multiUser.data[i].tb_contatti+" " +
                "A INNER JOIN "+multiUser.data[i].tb_notifiche+" B ON A._id=B._id_utente INNER JOIN "+multiUser.data[i].tb_eventi+" C ON C._id = B._id_evento " +
                "WHERE " +
                "A.username = '"+ username +"' AND A.token = '"+ token +"' AND B.eliminato = '" + eliminato + "' GROUP BY C._id , B._id, B._id_utente, B._id_evento;";

            const query = client.query(queryPostEventyById);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                let myOjb = JSON.stringify(result.rows, null, "    ");
                let final = JSON.parse(myOjb);
                if(final.length>0){
                    client.end();
                    return res.send(final);
                }else{
                    client.end();
                    return res.send(false);
                }

            });

        }
    }

});

module.exports = router;