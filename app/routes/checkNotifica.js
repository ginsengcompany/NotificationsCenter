var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');
var multiUser = require('../../config/configMultiUser');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiCheck = req.body;

    var organizzazione = req.session.cod_org;

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            var queryPostCheck = "UPDATE "+multiUser.data[i].tb_notifiche+"" +
                " SET stato=true ," +
                " data_invio=" +
                "'" + moment().format()   +"'"+
                " WHERE _id_medico=" +
                "'" + datiCheck._id_medico   +"'" +
                " AND _id_evento=" +
                "'" + datiCheck._id_evento   +"'";

            var client = connectionPostgres();

            const query = client.query(queryPostCheck);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                var myOjb = JSON.stringify(result.rows, null, "    ");
                var final = JSON.parse(myOjb);
                client.end();
                return res.json(datiCheck);
            });

        }
    }

});

module.exports = router;