let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let request = require('request');
let mySqlConnection = require('../../../config/RIMdatabase');

let connectionPostgres = function () {
    return postgresConnection();
};

router.get('/',function (req, res, next) {

    let querySent = 'SELECT * from "tb_hqSent"';

    let client = connectionPostgres();

    const query = client.query(querySent);
    client.end();


    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);


        for(let i=0; i<final.length; i++){

            let arrayDetails = {
                "numero" : "",
                "codutente" : "",
                "testo" : "",
                "data" : ""
            };


            request({
                url: 'https://app.mobyt.it/API/v1.0/REST/sms/'+final[i].id_order,
                method: 'GET',
                headers: {'user_key': '18443', 'Access_token': 'nZVc7WglBBWHy9eD6bGslST7'},

                callback: function (error, responseMeta, response) {
                    if (!error && responseMeta.statusCode == 200) {

                        response = JSON.parse(response);

                        if(response.result==='OK' && response.recipients[0].status==='DLVRD'){
                            arrayDetails.numero = final[this.i].numero;
                            arrayDetails.codutente = final[this.i].cod_utente;
                            arrayDetails.testo = 'Consegnato (ID: '+final[this.i].id_order+')';
                            arrayDetails.data = response.recipients[0].delivery_date;

                            insertRecordMYSQL(arrayDetails.numero,arrayDetails.codutente, arrayDetails.data,arrayDetails.testo,6,final[this.i]._id);


                        }
                        else if(response.result==='OK' && response.recipients[0].status==='ERROR'){
                            arrayDetails.numero = final[this.i].numero;
                            arrayDetails.codutente = final[this.i].cod_utente;
                            arrayDetails.testo = 'Errore Generico (ID: '+final[this.i].id_order+')';
                            arrayDetails.data = response.recipients[0].delivery_date;

                            insertRecordMYSQL(arrayDetails.numero,arrayDetails.codutente, arrayDetails.data,arrayDetails.testo,7,final[this.i]._id);

                        }
                        else if(response.result==='OK' && response.recipients[0].status==='INVALIDDST'){
                            arrayDetails.numero = final[this.i].numero;
                            arrayDetails.codutente = final[this.i].cod_utente;
                            arrayDetails.testo = 'Numero Destinatario Invalido (ID: '+final[this.i].id_order+')';
                            arrayDetails.data = response.recipients[0].delivery_date;

                            insertRecordMYSQL(arrayDetails.numero,arrayDetails.codutente, arrayDetails.data,arrayDetails.testo,7,final[this.i]._id);

                        }
                        else if(response.result==='OK' && response.recipients[0].status==='KO'){
                            arrayDetails.numero = final[this.i].numero;
                            arrayDetails.codutente = final[this.i].cod_utente;
                            arrayDetails.testo = 'Respinto da Rete Mobile (SMSC) (ID: '+final[this.i].id_order+')';
                            arrayDetails.data = response.recipients[0].delivery_date;

                            insertRecordMYSQL(arrayDetails.numero,arrayDetails.codutente, arrayDetails.data,arrayDetails.testo,7,final[this.i]._id);

                        }

                    }
                    else {
                        console.log('An error occurred..');
                    }
                }.bind( {i: i} )
            });

        }


    });

    return res.json({errore:false});

});

function deleteRecordPSQL(id){

    let queryDelete = 'DELETE from "tb_hqSent" WHERE _id='+id;

    let client = connectionPostgres();

    const query = client.query(queryDelete);
    client.end();

    query.on("row", function (row, result) {
        result.addRow(row);
    });

    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        console.log('Delete PgSql');

    });

}

function insertRecordMYSQL(numero,codutente,delivery_date,testo,tipo,id){

    let querySQL = 'INSERT INTO rim_portale.stats_detail (numero, codutente, data, testo, tipo) ' +
        'VALUES("'+numero+'", "'+codutente+'", '+delivery_date+', "'+testo+'", '+tipo+')';
    mySqlConnection.query(querySQL, function (err, result) {
        if (err){
            console.log(err);
        }
        if(result.insertId){
            console.log('Insert MySql');

            deleteRecordPSQL(id);

        }
    });


}


module.exports = router;