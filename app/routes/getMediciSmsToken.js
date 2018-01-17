var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {

    var queryPostEvento = "SELECT * FROM tb_medici_iscritti WHERE numero_telefono <> '' OR numero_telefono <> null OR token <> '' OR token <> null";

    var client = connectionPostgres();

    const query = client.query(queryPostEvento);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        var jsonFinale = {
            "data": final
        };
        return res.json(jsonFinale);
        client.end();
    });


});

module.exports = router;