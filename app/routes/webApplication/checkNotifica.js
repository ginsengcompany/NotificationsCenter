let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let datiCheck = req.body;

    let queryPostCheck = "UPDATE "+datiCheck.tb_notifica+"" +
        " SET stato=true ," +
        " data_invio=" +
        "'" + moment().format()   +"'"+
        " WHERE _id_utente=" +
        "'" + datiCheck._id_utente   +"'" +
        " AND _id_evento=" +
        "'" + datiCheck._id_evento   +"'";

    let client = connectionPostgres();

    const query = client.query(queryPostCheck);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        client.end();
        return res.json(datiCheck);
    });

});

module.exports = router;