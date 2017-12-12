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

    if(token!==null||token!==''||token!==undefined){

        var queryPostToken = "UPDATE tb_medici_iscritti SET token='"+token+"' WHERE matricola='"+ matricola +"'";

        const query = client.query(queryPostToken);

        query.on("row", function (row, result) {
            result.addRow(row);
        });

    }

    var queryPostMatricola = "SELECT * FROM tb_medici_iscritti WHERE matricola='"+ matricola +"'";

    const query = client.query(queryPostMatricola);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        if(final.length>0){
            return res.send(true);
        }else{
            return res.send(false);
        }

        client.end();
    });


});

module.exports = router;