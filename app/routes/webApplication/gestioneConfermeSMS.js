let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let request = require('request');
let mySqlConnection = require('../../../config/RIMdatabase');
let  lodash = require('lodash');
let multiTableRim = require('../../../config/configMultiTableRim');

moment.locale('it');

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

function formatDate(date) {
    var monthNames = [
        "Gennaio", "Febbraio", "Marzo",
        "Aprile", "Maggio", "Giugno", "Luglio",
        "Agosto", "Settembre", "Ottobre",
        "Novembre", "Dicembre"
    ];

    var day = date.getDate();
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var second = date.getSeconds();

    return day + ' ' + monthNames[monthIndex] + ' ' + year + " " +hour + ":" +minutes + ":" + second;
}

function responseProvider(arrayPG, i,arrayDetails){

    request({
        uri: 'https://app.mobyt.it/API/v1.0/REST/sms/'+arrayPG[i].id_order,
        method: 'GET',
        headers: {'user_key': '18443', 'Access_token': 'nZVc7WglBBWHy9eD6bGslST7'},

        callback: function (error, responseMeta, response) {
            if (!error && responseMeta.statusCode == 200) {

                response = JSON.parse(response);

                let dataString = response.recipients[0].delivery_date;

                let anno = dataString.substring(0, 4);
                let mese = dataString.substring(4, 6);
                let giorno = dataString.substring(6, 8);
                let ore = dataString.substring(8, 10);
                let minuti = dataString.substring(10, 12);
                let secondi = dataString.substring(12, 14);
                let res = anno+"-"+mese+"-"+giorno+" "+ore+":"+minuti+":"+secondi;

                if(response.result==='OK' && response.recipients[0].status==='DLVRD'){
                    arrayDetails.testo = 'Consegnato ' + formatDate(new Date(res));
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order,arrayPG[i].cod_utente);
                }
                else if(response.result==='OK' && response.recipients[0].status==='ERROR'){
                    arrayDetails.testo = 'Inviato Ma Non Certificato ' + formatDate(new Date(res));
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order,arrayPG[i].cod_utente);
                }
                else if(response.result==='OK' && response.recipients[0].status==='INVALIDDST'){
                    arrayDetails.testo = 'Numero Destinatario Invalido ' + formatDate(new Date(res));
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order,arrayPG[i].cod_utente);
                }
                else if(response.result==='OK' && response.recipients[0].status==='KO'){
                    arrayDetails.testo = 'Respinto da Rete Mobile (SMSC) ' + formatDate(new Date(res));
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order,arrayPG[i].cod_utente);
                }
                else if(response.result==='OK' && response.recipients[0].status==='TIMEOUT'){
                    arrayDetails.testo = 'Inviato Ma Non Certificato (TIMEOUT) ' + formatDate(new Date(res));
                    insertRecordMYSQL(arrayDetails.testo,arrayPG[i]._id,arrayPG[i].id_order,arrayPG[i].cod_utente);
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

function insertRecordMYSQL(testo,id,id_order,codUtente){

    let tbStruttura = lodash.filter(multiTableRim.data, { 'cod_str': codUtente } );

    let querySQL = 'UPDATE  rim_portale.'+tbStruttura[0].table+' SET stato_sms="' +testo+'" WHERE id_order="'+id_order+'"';

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