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
    var eliminato = req.body.eliminato;
    var organizzazione = req.body.organizzazione;

    for(var i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            var client = connectionPostgres();

            var queryPostEventyById =
                "SELECT * FROM "+multiUser.data[i].tb_contatti+" " +
                "A INNER JOIN "+multiUser.data[i].tb_notifiche+" B ON A._id=B._id_medico INNER JOIN "+multiUser.data[i].tb_eventi+" C ON C._id = B._id_evento " +
                "WHERE " +
                "A.matricola = '"+ matricola +"' AND A.token = '"+ token +"' AND B.eliminato = '" + eliminato + "';";

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

            });

        }
    }

});

module.exports = router;