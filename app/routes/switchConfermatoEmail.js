var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiEliminatoConfermato = req.body;
    var confermato = datiEliminatoConfermato.confermato;
    var idMedico = datiEliminatoConfermato._id_medico;
    var idEvento = datiEliminatoConfermato._id_evento;
    var queryPostConfermato = '';

    queryPostConfermato = "UPDATE tb_stato_notifiche SET confermato='"+confermato+"' WHERE _id_medico='"+ idMedico +"' AND _id_evento='"+idEvento+"'";


    var client = connectionPostgres();

    const query = client.query(queryPostConfermato);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json({errore:true});
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        return res.json({errore:false});
        client.end();
    });
});

module.exports = router;