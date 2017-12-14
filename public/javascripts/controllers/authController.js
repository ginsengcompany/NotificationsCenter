var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('./../../../config/configAuth');
var postgresConnection = require('../../../config/postgres');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/register', function(req, res) {

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    var datiRegistrazione = req.body;

    var queryRegistrazione = "INSERT INTO tb_admin " +
            "(email, password)" +
            "VALUES (" +
            "'" + datiRegistrazione.email   +"', " +
            "'" + hashedPassword  +"')";

    var client = connectionPostgres();

    const query = client.query(queryRegistrazione);

    query.on("row", function (row, result) {
            result.addRow(row);
        });

    query.on("end", function (err, user) {
        // create a token
        var token = jwt.sign(1, config.secret, {
            //expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ auth: true, token: token });
        client.end();
    });

    query.on("error", function (err, user) {
        if (err) return res.status(500).send("There was a problem registering the user.")
        });
    });

router.get('/me', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, config.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });

        res.status(200).send(decoded);
    });
});

module.exports = router;