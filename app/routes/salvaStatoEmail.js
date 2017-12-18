var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiStatoEmail = req.body;

    var queryPostStatoNotifica = "INSERT INTO tb_stato_email " +
        "(_id_medico, _id_evento, stato)" +
        "VALUES (" +
        "'" + datiStatoEmail.idMedico        +"', " +
        "'" + datiStatoEmail.idEvento   +"', " +
        "'" + datiStatoEmail.stato   +"')";

    var client = connectionPostgres();

    const query = client.query(queryPostStatoNotifica);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {

        return res.json({errore:true});
        client.end();

    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        return res.json(final);
        client.end();
    });


});

module.exports = router;