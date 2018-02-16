var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');
var path = require('path');
var moment = require('moment');
var request = require('request');
const fs = require('fs');

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

// Vettore di file xml
var files = [];

// Vettore che sarà riempito con record di tipo dataRecord
var dataArray = new Array();

// Percorso della directory contenente i file xml con i dati degli utenti
var percorsoFile = path.join(__dirname, '../../../FTPsyncMessage');

// Cartella di destinazione dove vengono temporaneamente memorizzati i file xml gia letti ed utilizzati
var percorsoFileDestinazione = path.join(__dirname, '../../../FTPsyncSuccess');

// Variabile di ritorno
var risultatoConversionXML = true;

var risultatoSMS;

// Estensione xml dei file
var fileType = '.xml';

router.get('/', function(req, res, next) {
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
            }
        }
    });
    res.send(risultatoConversionXML);
});

function checkFile(files){
    // Assegno il nome del file da controllare ad una variabile locale
    var nomeFile = files;
    // Verifico lo stato del percorso in cui è memorizzato il file e che ho passato alla funzione stat
    fs.stat(percorsoFile + '/' + nomeFile, function(err, fileStat) {
        if (err) {
            // In caso di errore ENOENT allora la directory non è esistente
            if (err.code == 'ENOENT') {
                console.log('La directory non esiste.');
            }
        } else {
            // Controllo se al path indicato trovo un file
            if (fileStat.isFile()) {
                console.log('File trovato.');
                // Eseguo la conversione del file al percorso indicato estrapolando i campi xml
                convertiXML(nomeFile);
            } else if (fileStat.isDirectory()) {
                // Accedo se il path indicato è una directory
                console.log('Directory non trovata.');
                risultatoConversionXML = false;
            }
        }
    });
}

function convertiXML (nomeFile) {

    // Creo una variabile parser usando il plugin Parser
    var parser = new xml2js.Parser();

    // Procedo alla lettura del file
    fs.readFile(percorsoFile + '/' + nomeFile, function (err, data) {
        // Eseguo il parsing dell'xml che viene inserito in un array di stringhe
        parser.parseString(data, function (err, result) {
            // Accedo ai campi dell'arrey contenneti i dati di interesse
            var xml = result['services']['service'];
            // Trasformo in un array JSON l'array di stringhe
            var xmlSTRING = JSON.stringify(xml);
            var xmlJSON = JSON.parse(xmlSTRING);
            // Incapsulo in una struttura dati di tipo array i record dell'array di JSON, Serve a filtrare il messaggio.
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
            // Ci consente di capire che la conversione XML è stata eseguita almeno una volta
            risultatoConversionXML = true;
            // Richiamo la funzione di invio sms per gli utenti i cui dati sono stati inseriti nel record dataArray
            var invioSMSCompleto = invioSMS(dataArray);
            if (invioSMSCompleto === true){
                // Ripulisco il dataArray per evitare che al prossima ciclo vengano accdati i dati dei nuovi utenti con i vecchi
                dataArray = [];
                // Creo una variabile con il nuovo nome del file
                var nuovoNomeFile = rinominaFile(nomeFile, timeStamp.substring(0,10), '.bak');
                // Rinomino il file
                fs.rename(percorsoFile + '/' + nomeFile, percorsoFile + '/' + nuovoNomeFile, function (err) {
                    if (err){
                        console.log('File non torvato.');
                    }else{
                        // Sposto il file nella posizione indicata dal nuovo path contenente i file già manipolati
                        fs.rename(percorsoFile + '/' + nuovoNomeFile, percorsoFileDestinazione+ '/' + nuovoNomeFile, function (err) {
                            if (err) throw err;
                            console.log('Spostamento eseguito con successo.');
                        });
                        console.log('File rinominato con successo.');
                    }
                });
            }
        });
    });
}

function invioSMS(dataArray) {
    var dataArrayNumero = [];
    var dataArrayMessaggi = [];
    for(var i=0;i<dataArray.length;i++){
        dataArrayNumero.push("+39"+ dataArray[i].destination);
        dataArrayMessaggi.push(dataArray[i].message);
    }
    for(var j=0;j<dataArrayNumero.length;j++) {
        request({
            url: 'https://app.mobyt.it/API/v1.0/REST/sms',
            method: 'POST',
            headers: {'user_key': '18443', 'Access_token': 'nZVc7WglBBWHy9eD6bGslST7'},

            json: true,
            body: {
                "recipient": [dataArrayNumero[j]],
                "message": dataArrayMessaggi[j],
                "message_type": "N",
                "sender" : "+393458184794"
            },
            callback: function (error, responseMeta, response) {
                if (!error && responseMeta.statusCode === 201) {
                    risultatoSMS = response.order_id;
                }
                else {
                    console.log("Errore invio sms");
                }
            }
        });
    }
    return true;
}

function  rinominaFile(nomeFile, timeStamp, estensione) {
    return nomeFile + timeStamp + estensione;
}

module.exports = router;
