var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiToken = req.body;

    var queryPostToken = "UPDATE tb_medici_iscritti" +
        " SET token=" +
        "'" + datiToken.token        +"' " +
        " WHERE matricola=" +
        "'" + datiToken.matricola   +"'";

    var client = connectionPostgres();

    const query = client.query(queryPostToken);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        return res.json(final);
        client.end();
    });


});

module.exports = router;