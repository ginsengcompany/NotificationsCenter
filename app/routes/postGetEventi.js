var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    var queryPostEvento = "SELECT * FROM tb_landing_evento ";

    var client = connectionPostgres();

    const query = client.query(queryPostEvento);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);

        for (var i = 0; i < final.length; i++){
            if (final[i].data != null)
                final[i].data = final[i].data.substring(0,10);
            if (final[i].data_fine != null)
                final[i].data_fine = final[i].data_fine.substring(0,10);
        }
        var jsonFinale = {
            "Result":"OK",
            "Records": final
        };

        return res.json(jsonFinale);
        client.end();
    });


});

module.exports = router;