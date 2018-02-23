let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let multiUser = require('../../../config/configMultiUser');
let rr = require('rr');

let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {



    let randomItem =rr (multiUser.data);

    let queryPostEvento = "select count(*) from "+randomItem.tb_notifiche+" where stato=false";

    let client = connectionPostgres();

    const query = client.query(queryPostEvento);

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb)[0];
        final.tb_notifiche = randomItem.tb_notifiche;
        final.tb_eventi = randomItem.tb_eventi;
        final.tb_contatti = randomItem.tb_contatti;
        final.descrizione = randomItem.descrizione;

        client.end();
        return res.json(final);

    });


});

module.exports = router;