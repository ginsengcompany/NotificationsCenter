var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var multiUser = require('../../config/configMultiUser');


var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var matricola = req.body.matricola;
    var token = req.body.token;
    var organizzazione = req.body.organizzazione;

    for(var i=0;i<multiUser.data.length;i++){

            if(multiUser.data[i].cod_org===organizzazione){

                var client = connectionPostgres();

                var queryPostToken = "UPDATE "+multiUser.data[i].tb_contatti+" SET token='"+token+"' WHERE matricola='"+ matricola +"'";

                const query1 = client.query(queryPostToken);

                query1.on("row", function (row, result) {
                    result.addRow(row);
                });

                var queryPostMatricola = "SELECT * FROM "+multiUser.data[i].tb_contatti+" WHERE matricola='"+ matricola +"'";

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

                });

            }
    }

});

module.exports = router;