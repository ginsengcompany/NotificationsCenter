var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');
var path = require('path');
var moment = require('moment');
var request = require('request');
const fs = require('fs');
var mySqlConnection = require('../../../config/RIMdatabase');
var lodash = require('lodash');
var postgresConnection = require('../../../config/postgres');

var connectionPostgres = function () {
    return postgresConnection();
};

// Variabile contenente i campi dell'xml utilizzati per raccogliere i dati degli utenti da contattare via sms
var dataRecord = {
    'serviceType' : '',
    'message' : '',
    'subject' : '',
    'destination' : '',
    'idTransaction': '',
    'priority' : ''
};

// Variabile che tiene conto dell'istante di tempo attuale
var timeStamp = moment().format();

// Percorso della directory contenente i file xml con i dati degli utenti
var percorsoFile = path.join(__dirname, '../../../FTPsyncMessage');

// Cartella di destinazione dove vengono temporaneamente memorizzati i file xml gia letti ed utilizzati
var percorsoFileDestinazione = path.join(__dirname, '../../../FTPsyncSuccess');

// Cartella di destinazione dove vengono temporaneamente memorizzati i file xml scartati
var percorsoFileScartati = path.join(__dirname, '../../../FTPdiscardedMessage');

// Variabile di ritorno
var risultatoConversionXML = true;

var risultatoSMS;

var tipi = [];

var mittenti = [];

var strutture = [];

// Estensione xml dei file
var fileType = '.xml';

selectMittenti();
selectStrutture();
selectTipi();

router.get('/', function(req, res, next) {
    // Vettore di file xml
    var files = [];

    // Opero una lettura della directory percorsoFile
    fs.readdir(percorsoFile, function(err,list){
        if(err) throw err;
        // Ciclo tutti i file contenuti nella directory
        for(var i=0; i<list.length; i++)
        {
            // Verifico se i file letti hanno estensione xml
            if(path.extname(list[i])===fileType)
            {
                // Inserisco tutti i file che ho letto all'interno di una struttura dati
                files.push(list[i]);
                // Richiamo la funzione che controlla i file e prende in argomento il nome del file da controllare
                checkFile(files[i]);
            }else if(path.extname(list[i])!==fileType)
            {
                rinominaSpostaDiscarded(list[i], 'GET');

            }
        }
    });
    res.send(risultatoConversionXML);
});

function selectStrutture(){

        var query = 'SELECT * FROM rim_portale.settings';
        mySqlConnection.query(query, function (err, result) {
            if (err){
                console.log(err);
            }
            if(result.length>0){

                strutture = result;

            }
        });
}

function selectMittenti(){
        var query = 'SELECT * FROM rim_portale.mittenti';
        mySqlConnection.query(query, function (err, result) {
            if (err){
                console.log(err);
            }
            if(result.length>0){

                mittenti = result;

            }
        });
}

function selectTipi(){
        var query = 'SELECT * FROM rim_portale.tipi';
        mySqlConnection.query(query, function (err, result) {
            if (err){
                console.log(err);
            }
            if(result.length>0){

                tipi = result;

            }
        });
}

function rinominaSpostaDiscarded(nomeFile, posizione){

    var nuovoNomeFile = rinominaFile(nomeFile, timeStamp.substring(0,10), '.bak');

    fs.rename(percorsoFile + '/' + nomeFile, percorsoFile + '/' + nuovoNomeFile, function (err) {
        if (err){
            console.log('File non trovato Discarded');
        }else{
            fs.rename(percorsoFile + '/' + nuovoNomeFile, percorsoFileScartati+ '/' + nuovoNomeFile, function (err) {
                if (err) throw err;
                console.log('Spostamento scartati Discarded '+posizione);
            });
            console.log('File rinominato scartati Discarded '+posizione);
        }
    });

}

function checkFile(files){
    // Assegno il nome del file da controllare ad una variabile locale
    var nomeFile = files;
    // Verifico lo stato del percorso in cui Ã¨ memorizzato il file e che ho passato alla funzione stat
    fs.stat(percorsoFile + '/' + nomeFile, function(err, fileStat) {
        if (err) {
            // In caso di errore ENOENT allora la directory non Ã¨ esistente
            if (err.code == 'ENOENT') {
                console.log('ENOENT EnoENT in checkFile');
            }
        } else {
            // Controllo se al path indicato trovo un file
            if (fileStat.isFile()) {
                console.log('File trovato in checkFile');
                // Eseguo la conversione del file al percorso indicato estrapolando i campi xml
                convertiXML(nomeFile);
            } else if (fileStat.isDirectory()) {
                // Accedo se il path indicato Ã¨ una directory
                console.log('Directory non trovata in checkFile');
                risultatoConversionXML = false;
            }
        }
    });
}

function convertiXML (nomeFile) {

    var parser = new xml2js.Parser();

    fs.readFile(percorsoFile + '/' + nomeFile, function (err, data) {

        parser.parseString(data, function (err, result) {

            if(result===null){
                rinominaSpostaDiscarded(nomeFile, 'ConvertiXML');
            }

            else if(result['services']){


                var xml = result['services']['service'];

                var xmlSTRING = JSON.stringify(xml);
                var xmlJSON = JSON.parse(xmlSTRING);

                var dataArray = [];

                for (var i = 0; i < xml.length; i ++){

                    dataRecord.serviceType = xmlJSON[i]['serviceType'][0];
                    dataRecord.message = xmlJSON[i]['message'][0];
                    dataRecord.subject = xmlJSON[i]['subject'][0];
                    dataRecord.destination = xmlJSON[i]['destination'][0];
                    dataRecord.idTransaction = xmlJSON[i]['idTransaction'][0];
                    dataRecord.priority = xmlJSON[i]['priority'][0];

                    dataArray.push(dataRecord);
                    dataRecord = {};
                }


                risultatoConversionXML = true;

                checkStruttura(dataArray,nomeFile);

            }else{

                rinominaSpostaDiscarded(nomeFile, 'ConvertiXML2');
            }

        });
    });
}

function  rinominaFile(nomeFile, timeStamp, estensione) {
    return nomeFile + timeStamp + estensione;
}

function checkStruttura(dataArray,nomeFile){

    for(var i=0; i<dataArray.length; i++){

        var arrayDetails = {
            "numero" : "",
            "codutente" : "",
            "testo" : "",
            "tipo" : "",
            "mittente" : "",
            "quantita" : "",
            "numMittente" : "",
            "id_order" : ""
        };

        var stringa = dataArray[i].idTransaction;
        var message = dataArray[i].message;
        var destination = dataArray[i].destination;
        var arraySplit = stringa.split('-');
        var struttura = lodash.filter(strutture, { 'codutente': arraySplit[0] } );

            if(struttura.length>0){
                arrayDetails.codutente = arraySplit[0];
                arrayDetails.numero = destination;
                arrayDetails.testo = message;
                var tipo = lodash.filter(tipi, { 'codice': arraySplit[1] } );
                arrayDetails.tipo = tipo[0].id_tipo;
                var mittente = lodash.filter(mittenti, { 'codice': arraySplit[2] } );
                arrayDetails.mittente = mittente[0].id_mittente;
                arrayDetails.numMittente = struttura[0].numMittente;
                invioSMS(arrayDetails,nomeFile)
            }
            else if (struttura.length===0){
                rinominaSpostaDiscarded(nomeFile, 'CheckStruttura');
            }

    }
}

function invioSMS(arrayDetails,nomeFile) {

    var dataArrayNumero = [];

    var numValidator = controlloNumeroTelefono(arrayDetails.numero);

    if(numValidator.validate===true) {
        dataArrayNumero.push("+39" + numValidator.numero);
    }

    if(dataArrayNumero.length>0 && arrayDetails.numMittente !== null){
        console.log('Alta qualità');
        request({
            url: 'https://app.mobyt.it/API/v1.0/REST/sms',
            method: 'POST',
            headers: {'user_key': '18443', 'Access_token': 'nZVc7WglBBWHy9eD6bGslST7'},

            json: true,
            body: {
                "recipient": [dataArrayNumero[0]],
                "message": arrayDetails.testo,
                "message_type": "N",
                "sender" : arrayDetails.numMittente
            },
            callback: function (error, responseMeta, response) {
                if (!error && responseMeta.statusCode === 201) {

                    arrayDetails.quantita = response.total_sent;
                    arrayDetails.id_order = response.order_id;

                    appendRimPortal(arrayDetails,nomeFile);
                }
                else {
                    console.log("Errore invio sms");
                }
            }
        });
    }

    else if (dataArrayNumero.length>0 && arrayDetails.numMittente === null){
        console.log('Bassa qualità');
    }

    else if (dataArrayNumero.length===0){
        rinominaSpostaDiscarded(nomeFile, 'invioSMS');
    }
}

function controlloNumeroTelefono(stringa) {
    const regex = /^(\((00|\+)39\)|(00|\+)39)?(3[0-9][0-9])\d{6,7}$/gm;
    var m;
    response = {"validate":'', "numero":''};
    var res = '';

    while ((m = regex.exec(stringa)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
            regex.lastIndex++;
        }
        // The result can be accessed through the `m`-variable.
        m.forEach(function (match, groupIndex) {
            if(match===undefined && groupIndex===1){
                response.validate = true;
                response.numero = stringa;
            }
            if(match==='+39' && groupIndex===1){
                response.validate = true;
                res = stringa.substring(3, 13);
                response.numero = res;
            }
            if(match==='0039' && groupIndex===1){
                response.validate = true;
                res = stringa.substring(4, 14);
                response.numero = res;
            }
            if(match==='(+39)' && groupIndex===1){
                response.validate = true;
                res = stringa.substring(5, 15);
                response.numero = res;
            }
            if(match==='(0039)' && groupIndex===1){
                response.validate = true;
                res = stringa.substring(6, 16);
                response.numero = res;
            }
        });
    }

    return response;
}

function appendRimPortal(arrayDetails,nomeFile){
    console.log(arrayDetails);
    var query = 'INSERT INTO rim_portale.stats_detail (numero, codutente, data, testo, tipo, mittente, quantita) ' +
                'VALUES("+39'+arrayDetails.numero+'", "'+arrayDetails.codutente+'", current_timestamp(), "'+arrayDetails.testo+'", '+arrayDetails.tipo+',  '+arrayDetails.mittente+', '+arrayDetails.quantita+')';
    mySqlConnection.query(query, function (err, result) {
        if (err){
            console.log(err);
        }
        if(result.insertId){

            var nuovoNomeFile = rinominaFile(nomeFile, timeStamp.substring(0,10), '.bak');

            fs.rename(percorsoFile + '/' + nomeFile, percorsoFile + '/' + nuovoNomeFile, function (err) {
                if (err){
                    console.log('File non trovato.');
                }else{

                    fs.rename(percorsoFile + '/' + nuovoNomeFile, percorsoFileDestinazione+ '/' + nuovoNomeFile, function (err) {
                        if (err) throw err;
                        console.log('Spostamento eseguito con successo.');

                    });
                    console.log('File rinominato con successo.');
                }
            });

            var query1 = 'INSERT INTO "tb_hqSent" (numero, cod_utente, id_order) ' +
                         "VALUES (" +
                         "'+39" + arrayDetails.numero      +"', " +
                         "'" + arrayDetails.codutente     +"', " +
                         "'" + arrayDetails.id_order   +"')";

            var client = connectionPostgres();

            const query2 = client.query(query1);

            query2.on("row", function (row, result) {
                result.addRow(row);
            });

            query2.on("end", function (result) {
                var myOjb = JSON.stringify(result.rows, null, "    ");
                client.end();
            });
        }
    });
}

module.exports = router;
