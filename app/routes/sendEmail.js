var nodemailer = require('nodemailer');
var express = require('express');
var router = express.Router();
var postgresConnection = require('../../config/postgres');
var moment = require('moment');

var connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    var datiEmail = req.body;

    var transporter = nodemailer.createTransport({
        service: datiEmail.service,
        auth: {
            user: datiEmail.user,
            pass: datiEmail.pass
        }
    });

    var mailOptions = {
        from: datiEmail.from,
        to: datiEmail.to,
        subject: datiEmail.subject,
        text: datiEmail.text
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            return res.json(true);
        }
    });

});

module.exports = router;

