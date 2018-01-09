var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {

    var datiUpdateOrDelete = req.body;

    var client = connectionPostgres();

    //var queryUpdateOrDelete2 = "DELETE FROM tb_landing_evento WHERE _id_evento=" + datiUpdateOrDelete.data._id;
    var queryUpdateOrDelete3 = "DELETE FROM tb_landing_evento WHERE _id= " + datiUpdateOrDelete._id;

    const query = client.query(queryUpdateOrDelete3);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function () {
        return res.json(false);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        //
        final = {"Result": "OK"};
        //
        return res.json(final);
        client.end();
    });
});



module.exports = router;