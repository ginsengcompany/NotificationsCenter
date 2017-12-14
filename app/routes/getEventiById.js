var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var matricola = req.body.matricola;
    var token = req.body.token;

    var client = connectionPostgres();

    var queryPostEventyById = "SELECT * FROM tb_medici_iscritti A INNER JOIN tb_stato_notifiche B ON A._id=B._id_medico INNER JOIN tb_landing_evento C ON C._id=B._id_evento  WHERE A.matricola='"+ matricola +"' AND A.token='"+ token +"' AND B.eliminato=false";

    const query = client.query(queryPostEventyById);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        if(final.length>0){
            return res.send(final);
        }else{
            return res.send(false);
        }

        client.end();
    });


});

module.exports = router;