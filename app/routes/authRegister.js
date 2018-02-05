var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');


var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/', function(req, res, next) {

    var datiRegistrazione = req.body;
    var email = datiRegistrazione.email;
    var password = datiRegistrazione.password;

    if(email==='\' or \'\'=\''||password==='\' or \'\'=\''){

        email=null;
        password=null;

    }

    var client = connectionPostgres();

    var queryAutenticazione = "SELECT * FROM tb_admin WHERE email='"+email+"' AND password='"+password+"'";
    const query = client.query(queryAutenticazione);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json(false);
    });

    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        var jsonFinale = {
            "data": final
        };

        if(jsonFinale.data.length===1){

            return res.json({errore:false,id:jsonFinale.data[0]});


        }else if(jsonFinale.data.length===0){

            return res.json({errore:true});

        }


        client.end();
    });




});



module.exports = router;