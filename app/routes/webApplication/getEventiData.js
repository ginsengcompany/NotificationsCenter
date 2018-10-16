let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let multiUser = require('../../../config/configMultiUser');
let moment = require('moment');
let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let dataInizioEvento = req.body;
    let dataFormat = moment(dataInizioEvento, 'DD/MM/YYYY').format('YYYY-MM-DD');
    let organizzazione = req.session.cod_org;

    let client = connectionPostgres();

    for(let i=0;i<multiUser.data.length;i++) {

        if (multiUser.data[i].cod_org === organizzazione) {

            let queryPostEvento = "SELECT * FROM "+multiUser.data[i].tb_eventi+" WHERE data >= '" + dataFormat + "'" ;

            const query = client.query(queryPostEvento);

            query.on("row", function (row, result) {
                result.addRow(row);
            });

            query.on("end", function (result) {
                let myOjb = JSON.stringify(result.rows, null, "    ");
                let final = JSON.parse(myOjb);
                client.end();
                return res.json(final);
            });

        }
    }




});

module.exports = router;