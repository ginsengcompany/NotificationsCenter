let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');

let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {

    let confermato = req.query.confermato;
    let eliminato = req.query.eliminato;
    let idUtente = req.query.idUtente;
    let idEvento = req.query.idEvento;
    let tb_notifica = req.query.tb_notifica;

    let queryPostConfermato = '';

    queryPostConfermato = "UPDATE "+tb_notifica+" SET confermato='"+confermato+"', eliminato='"+eliminato+"' WHERE _id_utente='"+ idUtente +"' AND _id_evento='"+idEvento+"'";


    let client = connectionPostgres();

    const query = client.query(queryPostConfermato);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        client.end();
        return res.json({errore:true});
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        if(confermato==='true'){

            return res.redirect('/partecipato');
        }
        if(eliminato==='true'){

            return res.redirect('/declinato');
        }
        client.end();
        res.json({errore:false});

    });

});

module.exports = router;