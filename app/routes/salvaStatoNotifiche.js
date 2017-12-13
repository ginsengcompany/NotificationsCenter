var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiStatoNotifica = req.body;

    var queryPostStatoNotifica = "INSERT INTO tb_stato_notifiche " +
        "(_id_medico, _id_evento, stato, confermato, eliminato, data_invio)" +
        "VALUES (" +
        "'" + datiStatoNotifica.idMedico        +"', " +
        "'" + datiStatoNotifica.idEvento   +"', " +
        "'" + datiStatoNotifica.stato   +"', " +
        "'" + datiStatoNotifica.confermato   +"', " +
        "'" + datiStatoNotifica.eliminato   +"', " +
        "'" + moment().format()   +"')";

    var client = connectionPostgres();

    const query = client.query(queryPostStatoNotifica);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json({errore:true});
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        return res.json(final);
        client.end();
    });


});

module.exports = router;