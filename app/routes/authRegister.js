var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../../config/configAuth');
var postgresConnection = require('../../config/postgres');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/', function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var datiRegistrazione = req.body;

    var client = connectionPostgres();

    var queryAutenticazione = "SELECT COUNT (*) FROM tb_admin WHERE email='"+datiRegistrazione.email+"' AND password='"+hashedPassword+"'";
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

        if(final.length===1){

            var token = jwt.sign(1, config.secret, {

            });

            return res.json({ auth: true, token: token });

        }else{

            var queryRegistrazione = "INSERT INTO tb_admin " +
                "(email, password)" +
                "VALUES (" +
                "'" + datiRegistrazione.email   +"', " +
                "'" + hashedPassword  +"')";

            const query = client.query(queryRegistrazione);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on('error', function() {
                return res.json(false);
            });

            query.on("end", function (err, user) {
                // create a token
                var token = jwt.sign(1, config.secret, {
                    //expiresIn: 86400 // expires in 24 hours
                });
                res.json({ auth: true, token: token });
                client.end();
            });

        }

    });



});

module.exports = router;