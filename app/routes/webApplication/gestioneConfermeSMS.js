let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let request = require('request');
let mySqlConnection = require('../../../config/RIMdatabase');
const https = require("https");

let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {

    let querySent = 'SELECT * from "tb_hqSent"';

    (async () => {
        const client = await connectionPostgres();
        try {
            const res = await client.query(querySent);
            console.log('Select PgSql');
            if(res.rows.length>0){

                for(let i=0; i<res.rows.length; i++){

                    let arrayDetails = {
                        "testo" : ""
                    };

                    responseProvider(res.rows, i, arrayDetails);

                }


            }
        } finally {
            client.end()
        }
    })().catch(e => console.log(e.stack));

    return res.json({errore:false});

});

function responseProvider(arrayPG, i,arrayDetails){

    request({
        uri: 'https://app.mobyt.it/API/v1.0/REST/sms/'+arrayPG[i].id_order,
        method: 'GET',
        headers: {'user_key': '18443', 'Access_token': 'nZVc7WglBBWHy9eD6bGslST7'},

        callback: function (error, responseMeta, response) {
            if (!error && responseMeta.statusCode == 200) {

                response = JSON.parse(response);

                if(response.result==='OK' && response.recipients[0].status==='DLVRD'){
                    arrayDetails.testo = 'Consegnato';
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order);
                }
                else if(response.result==='OK' && response.recipients[0].status==='ERROR'){
                    arrayDetails.testo = 'Errore Generico';
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order);
                }
                else if(response.result==='OK' && response.recipients[0].status==='INVALIDDST'){
                    arrayDetails.testo = 'Numero Destinatario Invalido';
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order);
                }
                else if(response.result==='OK' && response.recipients[0].status==='KO'){
                    arrayDetails.testo = 'Respinto da Rete Mobile (SMSC)';
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order);
                }

            }
            else {
                console.log('ERRORE PROVIDER');
            }
        }
    });


}

function deleteRecordPSQL(id){

    let queryDelete = 'DELETE from "tb_hqSent" WHERE _id='+id;

    (async () => {
        const client = await connectionPostgres();
        try {
            const res = await client.query(queryDelete);
            console.log('Delete PgSql');
        } finally {
            client.end()
        }
    })().catch(e => console.log(e.stack));

}

function insertRecordMYSQL(testo,id,id_order){

    let querySQL = 'UPDATE  rim_portale.stats_detail SET stato_sms="' +testo+'" WHERE id_order="'+id_order+'"';

    mySqlConnection.query(querySQL, function (err, result) {
        if (err){
            console.log(err);
        }
        if(result){
            console.log('Insert MySql');
            deleteRecordPSQL(id);
        }
    });


}


module.exports = router;