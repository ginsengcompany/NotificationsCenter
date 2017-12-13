var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiEliminatoConfermato = req.body;
    var eliminato = datiEliminatoConfermato.eliminato;
    var confermato = datiEliminatoConfermato.confermato;
    var idMedico = datiEliminatoConfermato.idMedico;
    var idEvento = datiEliminatoConfermato.idMedico;
    var queryPostEliminatoConfermato = '';

    if(eliminato===true&&confermato===null){

        queryPostEliminatoConfermato = "UPDATE tb_stato_notifiche SET eliminato='"+eliminato+"' WHERE _id_medico='"+ idMedico +"' AND _id_evento='"+idEvento+"'";

    }else if(eliminato===null&&confermato===true){

        queryPostEliminatoConfermato = "UPDATE tb_stato_notifiche SET confermato='"+confermato+"' WHERE _id_medico='"+ idMedico +"' AND _id_evento='"+idEvento+"'";

    }


    var client = connectionPostgres();

    const query = client.query(queryPostEliminatoConfermato);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        return res.json(final);
        client.end();
    });
});

module.exports = router;