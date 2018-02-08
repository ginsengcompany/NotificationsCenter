var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {

    var confermato = req.query.confermato;
    var eliminato = req.query.eliminato;
    var idMedico = req.query.idMedico;
    var idEvento = req.query.idEvento;
    var tb_notifica = req.query.tb_notifica;

    var queryPostConfermato = '';

    queryPostConfermato = "UPDATE "+tb_notifica+" SET confermato='"+confermato+"', eliminato='"+eliminato+"' WHERE _id_medico='"+ idMedico +"' AND _id_evento='"+idEvento+"'";


    var client = connectionPostgres();

    const query = client.query(queryPostConfermato);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        client.end();
        return res.json({errore:true});
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
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