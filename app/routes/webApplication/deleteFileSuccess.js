let express = require('express');
let router = express.Router();
let  path = require('path');
const fs = require('fs');


let  percorsoFileDestinazione = path.join(__dirname, '../../../FTPsyncSuccess');

router.get('/',function (req, res, next) {

    let  files = [];

    fs.readdir(percorsoFileDestinazione, function(err,list){
        if(err) throw err;

        for(let  i=0; i<list.length; i++)
        {
            // Inserisco tutti i file che ho letto all'interno di una struttura dati
            files.push(list[i]);
            checkFile(files[i]);
        }
    });


    return res.json({errore:false});

});

function checkFile(files){

    let  nomeFile = files;

    fs.stat(percorsoFileDestinazione + '/' + nomeFile, function(err, fileStat) {
        if (err) {
            if (err.code == 'ENOENT') {
                console.log('ENOENT EnoENT in checkFile');
            }
        } else {
            if (fileStat.isFile()) {
                console.log('File trovato in checkFile');
                deleteFile(nomeFile);
            } else if (fileStat.isDirectory()) {
                console.log('Directory non trovata in checkFile');
            }
        }
    });
}

function addDays(days) {
    let dat = new Date();
    dat.setDate(dat.getDate() - days);
    return dat;
}

function deleteFile(nomeFile){

    fs.stat(percorsoFileDestinazione + '/' + nomeFile, function(err, stats) {

        let data = new Date(stats.atimeMs);

        let a = addDays(2);

        if( a.getDay() === data.getDay()){

            fs.unlink(percorsoFileDestinazione + '/' + nomeFile, (err) => {
                if (err) throw err;
                console.log('Eliminaione effettuata con successo');
            });
            console.log(data);

        }

    });

}


module.exports = router;