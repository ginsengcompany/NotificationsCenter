var express = require('express');
var router = express.Router();
var xml2js = require('xml2js');
var path = require('path');
var moment = require('moment');
var request = require('request');
const fs = require('fs');
var mySqlConnection = require('../../../config/RIMdatabase');

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

// Percorso della directory contenente i file xml con i dati degli utenti
var percorsoFile = path.join(__dirname, '../../../FTPsyncMessage');

// Cartella di destinazione dove vengono temporaneamente memorizzati i file xml gia letti ed utilizzati
var percorsoFileDestinazione = path.join(__dirname, '../../../FTPsyncSuccess');

// Cartella di destinazione dove vengono temporaneamente memorizzati i file xml scartati
var percorsoFileScartati = path.join(__dirname, '../../../FTPdiscardedMessage');

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
            }else if(path.extname(list[i])!==fileType)
            {
                var nuovoNomeFile = rinominaFile(list[i], timeStamp.substring(0,10), '.bak');

                // Rinomino il file
                fs.rename(percorsoFile + '/' + list[i], percorsoFile + '/' + nuovoNomeFile, function (err) {
                    if (err){
                        console.log('File non trovato scartati.');
                    }else{
                        // Sposto il file nella posizione indicata dal nuovo path contenente i file scartati
                        fs.rename(percorsoFile + '/' + nuovoNomeFile, percorsoFileScartati+ '/' + nuovoNomeFile, function (err) {
                            if (err) throw err;
                            console.log('Spostamento scartati.');
                        });
                        console.log('File rinominato scartati.');
                    }
                });

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
                console.log('errore EnoENT.');
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

            if(result===null){

                // Creo una variabile con il nuovo nome del file
                var nuovoNomeFile = rinominaFile(nomeFile, timeStamp.substring(0,10), '.bak');

                // Rinomino il file
                fs.rename(percorsoFile + '/' + nomeFile, percorsoFile + '/' + nuovoNomeFile, function (err) {
                    if (err){
                        console.log('File non trovato.');
                    }else{
                        // Sposto il file nella posizione indicata dal nuovo path contenente i file già manipolati
                        fs.rename(percorsoFile + '/' + nuovoNomeFile, percorsoFileScartati+ '/' + nuovoNomeFile, function (err) {
                            if (err) throw err;
                            console.log('Spostamento scartati.');
                        });
                        console.log('File rinominato scartati.');
                    }
                });

            }

            else if(result['services']){

                // Accedo ai campi dell'arrey contenneti i dati di interesse
                var xml = result['services']['service'];
                // Trasformo in un array JSON l'array di stringhe
                var xmlSTRING = JSON.stringify(xml);
                var xmlJSON = JSON.parse(xmlSTRING);

                var dataArray = [];
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
                invioSMS(dataArray,nomeFile);

            }else{

                // Creo una variabile con il nuovo nome del file
                var nuovoNomeFile = rinominaFile(nomeFile, timeStamp.substring(0,10), '.bak');

                // Rinomino il file
                fs.rename(percorsoFile + '/' + nomeFile, percorsoFile + '/' + nuovoNomeFile, function (err) {
                    if (err){
                        console.log('File non trovato.');
                    }else{
                        // Sposto il file nella posizione indicata dal nuovo path contenente i file già manipolati
                        fs.rename(percorsoFile + '/' + nuovoNomeFile, percorsoFileScartati+ '/' + nuovoNomeFile, function (err) {
                            if (err) throw err;
                            console.log('Spostamento scartati.');
                        });
                        console.log('File rinominato scartati.');
                    }
                });

            }

        });
    });
}

function  rinominaFile(nomeFile, timeStamp, estensione) {
    return nomeFile + timeStamp + estensione;
}

function invioSMS(dataArray,nomeFile) {
    var dataArrayNumero = [];
    var dataArrayMessaggi = [];
    for(var i=0;i<dataArray.length;i++){
        dataArrayNumero.push("+39"+ dataArray[i].destination);
        dataArrayMessaggi.push(dataArray[i].message);
    }
    console.log(dataArray);
    for(var j=0;j<dataArrayNumero.length;j++) {
        var arraySQL = dataArray[j];
        request({
            url: 'https://app.mobyt.it/API/v1.0/REST/sms',
            method: 'POST',
            headers: {'user_key': '18443', 'Access_token': 'nZVc7WglBBWHy9eD6bGslST7'},

            json: true,
            body: {
                "recipient": [dataArrayNumero[j]],
                "message": dataArrayMessaggi[j],
                "message_type": "N",
                "sender" : "+393711823424"
            },
            callback: function (error, responseMeta, response) {
                if (!error && responseMeta.statusCode === 201) {

                    // Creo una variabile con il nuovo nome del file
                    var nuovoNomeFile = rinominaFile(nomeFile, timeStamp.substring(0,10), '.bak');

                    // Rinomino il file
                    fs.rename(percorsoFile + '/' + nomeFile, percorsoFile + '/' + nuovoNomeFile, function (err) {
                        if (err){
                            console.log('File non trovato.');
                        }else{
                            // Sposto il file nella posizione indicata dal nuovo path contenente i file già manipolati
                            fs.rename(percorsoFile + '/' + nuovoNomeFile, percorsoFileDestinazione+ '/' + nuovoNomeFile, function (err) {
                                if (err) throw err;
                                console.log('Spostamento eseguito con successo.');
                                risultatoSMS = response.order_id;
                                // Ripulisco il dataArray per evitare che al prossima ciclo vengano accdati i dati dei nuovi utenti con i vecchi
                                dataArray = [];

                                var query = 'INSERT INTO rim.service (id_service_state, message_service_state, id_user, username, id_comune, id_access_list, insert_date, modify_date, description, priority, message,' +
                                    ' subject, start_date, end_date, feedback, is_pin, path_csv, is_message_path, welcome_message, is_welcome_message_path, end_message, is_end_message_path,' +
                                    ' error_message, is_error_message_path, info_type, user_type, geo_area, is_cc, is_rapid_message, is_stopped, notify_result, notify_result_code,' +
                                    ' notify_result_description, notify_insert_date, notify_modify_date)\n' +
                                    'VALUES (4, "The Address property on ChannelFactory.Endpoint was null.  The ChannelFactory\'s Endpoint must have a valid Address specified.", null, null, 4,' +
                                    ' 1, current_timestamp(), null, "'+arraySQL.idTransaction+'", '+arraySQL.priority+', "'+arraySQL.message+'", null, current_timestamp(), DATE_ADD(SYSDATE(), INTERVAL 7 DAY), ' +
                                    ' null, "N", null, null, null, null, null, null, null, null, null, null, null, "N", "N", "N", null, null, null, null, null)';

                                mySqlConnection.query(query, function (err, result) {
                                    if (err){
                                        console.log(err);
                                    }
                                    if(result.insertId){
                                        var query2 = 'INSERT INTO rim.service_item (id_service, id_service_item_type, id_service_item_state, message_service_item_state, insert_date, modify_date, destination, service_user, ' +
                                            'destination_username, destination_pin, destination_priority, destination_time_from, destination_time_to, retry_number, retry_date, force_send, send_date, result, result_code, result_description, ' +
                                            'result_feedback, result_pin, subject_pec)\n' +
                                            'VALUES ('+result.insertId+', 2, 3, "SMS Inviato", current_timestamp(), null, "'+arraySQL.destination+'", null, null, null, 0, null, null, 0, null, "N", current_timestamp(), "ok", null, "SMS Inviato", ' +
                                            'null, null, null)';
                                        mySqlConnection.query(query2, function (err, result) {
                                            if (err){
                                                console.log(err);
                                            }
                                            if(result){
                                                console.log('RIM Completato');

                                            }
                                        });
                                    }
                                });
                            });
                            console.log('File rinominato con successo.');
                        }
                    });

                }
                else {
                    console.log("Errore invio sms");
                }
            }
        });
    }
}

module.exports = router;
