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

    if(datiUpdateOrDelete.data.length===10 && datiUpdateOrDelete.dataFine.length===10)

    var dd1 = datiUpdateOrDelete.data.substr(0,2);
    var mm1 = datiUpdateOrDelete.data.substr(3,2);
    var yy1 = datiUpdateOrDelete.data.substr(6,10);
    var dd2 = datiUpdateOrDelete.dataFine.substr(0,2);
    var mm2 = datiUpdateOrDelete.dataFine.substr(3,2);
    var yy2 = datiUpdateOrDelete.dataFine.substr(6,10);
    var data_inizio = yy1+'-'+mm1+'-'+dd1;
    var data_fine = yy2+'-'+mm2+'-'+dd2;

    var queryUpdateOrDelete1 =
        "UPDATE tb_landing_evento SET " +
        "titolo='" + datiUpdateOrDelete.titolo + "', " +
        "sottotitolo='" + datiUpdateOrDelete.sottotitolo + "', " +
        "data='" + moment().format(datiUpdateOrDelete.data) + "', " +
        "luogo='" + datiUpdateOrDelete.luogo + "', " +
        "informazioni='" + datiUpdateOrDelete.informazioni + "', " +
        "relatori='" + datiUpdateOrDelete.relatori + "', " +
        "descrizione='" + datiUpdateOrDelete.descrizione + "', " +
        "data_fine='" + moment().format(datiUpdateOrDelete.dataFine) + "' " +
        "WHERE _id=" + datiUpdateOrDelete._id;

    const query = client.query(queryUpdateOrDelete1);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function () {
        return res.json({errore:true});
        return res.json(final);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        //
        final = {"Result": "OK"};
        //
        return res.json({errore:false});
        client.end();
    });
});

module.exports = router;