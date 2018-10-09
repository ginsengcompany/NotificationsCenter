let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');


let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/', function(req, res, next) {

    let datiRegistrazione = req.body;
    let email = datiRegistrazione.email;
    let password = datiRegistrazione.password;

    if(email==='\' or \'\'=\''||password==='\' or \'\'=\''){

        email=null;
        password=null;

    }

    let client = connectionPostgres();

    let queryAutenticazione = "SELECT * FROM tb_admin WHERE email='"+email+"' AND password='"+password+"'";
    const query = client.query(queryAutenticazione);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on('error', function() {
        return res.json(false);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        let jsonFinale = {
            "data": final
        };

        if(jsonFinale.data.length === 1){
            req.session.sms_attivo = jsonFinale.data[0].sms_attivo;
            client.end();
            return res.json({errore:false,id:jsonFinale.data[0]});

        }else if(jsonFinale.data.length === 0){

            client.end();
            return res.json({errore:true});

        }
    });


});


module.exports = router;