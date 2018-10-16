let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let moment = require('moment');
let request = require('request');
let path = require('path');


let connectionPostgres = function () {
    return postgresConnection();
};


let datiEmail = {
    "to":undefined,
    "subject":undefined,
    "html": undefined,
    "arrayEventi" : undefined,
    "arrayUtenti" : undefined,
    "tb_notifica" : undefined
};

function switchInvio(final,datiTab){
        for(let i=0;i<final.length;i++){
            posyQuery(final[i],datiTab);
        }
}

function posyQuery(indice,datiTab) {

    var client = connectionPostgres();


    let queryPostEvento = "SELECT * FROM "+datiTab.tb_eventi+" WHERE _id="+indice._id_evento;
    let queryPostUtente = "SELECT * FROM "+datiTab.tb_contatti+" WHERE _id="+indice._id_utente;

    let query1 = client.query(queryPostEvento);

    query1.on("row", function (row, result) {
        result.addRow(row);
        let myOjb = JSON.stringify(result.rows, null, "    ");
        datiEmail.arrayEventi = JSON.parse(myOjb)[0];

        let query2 = client.query(queryPostUtente);

        query2.on("row", function (row, result) {
            result.addRow(row);
            let myOjb = JSON.stringify(result.rows, null, "    ");
            datiEmail.arrayUtenti = JSON.parse(myOjb)[0];

            if(indice.tipo==='Push Notifications'){

                if(datiEmail.arrayEventi && datiEmail.arrayUtenti){
                    let restKey = 'OTM3ZGZiOGUtZjNiYS00YTAxLWFjYmMtMDRjN2I2NjE5MWE2';
                    let appID = 'b560b667-aa97-4980-a740-c8fc7925e208';
                    let message = 'Nuovo evento: ' + datiEmail.arrayEventi.titolo;
                    let device  = datiEmail.arrayUtenti.token;

                    const options = {
                        method:'POST',
                        uri:'https://onesignal.com/api/v1/notifications',
                        headers: {
                            "Authorization": "Basic "+restKey,
                            "Content-Type": "application/json"
                        },
                        json: true,
                        body:{
                            'app_id': appID,
                            'headings' : {en: 'Notifications Center'},
                            'contents': {en: message},
                            'include_player_ids': Array.isArray(device) ? device : [device],
                            'large_icon': path.join(__dirname,'public/images/notificationsIcons','icon.png')
                        }
                    };

                    const options1 = {
                        url: 'http://localhost:3000/checkNotifica',
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Accept-Charset': 'utf-8'
                        },
                        json: true,
                        body: {"_id_utente":indice._id_utente, "_id_evento":indice._id_evento, "tb_notifica": datiTab.tb_notifiche}
                    };

                    setTimeout(function () {

                        request(options, function (error, response, body) {
                            if (!error && response.statusCode === 200) {
                                request(options1, function (error, response, body) {
                                    if (!error && response.statusCode === 200) {
                                        client.end();
                                    }
                                })
                            }
                        })
                    },3000);

                }

            }

            else if(indice.tipo==='E-mail'){

                if(datiEmail.arrayEventi && datiEmail.arrayUtenti){
                    datiEmail.to = indice.mail;
                    datiEmail.tb_notifica = datiTab.tb_notifiche;
                    datiEmail.subject = "Notifications - Center , Leggi subito per scoprire!";

                    const options = {
                        url: 'http://localhost:3000/sendEmail',
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Accept-Charset': 'utf-8'
                        },
                        json: true,
                        body: datiEmail
                    };

                    const options1 = {
                        url: 'http://localhost:3000/checkNotifica',
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Accept-Charset': 'utf-8'
                        },
                        json: true,
                        body: {"_id_utente":indice._id_utente, "_id_evento":indice._id_evento,  "tb_notifica": datiTab.tb_notifiche}
                    };

                    setTimeout(function () {

                        request(options, function (error, response, body) {
                            if (!error && response.statusCode === 200) {
                                request(options1, function (error, response, body) {
                                    if (!error && response.statusCode === 200) {
                                        client.end();
                                    }
                                })
                            }
                        })

                    },3000);


                }

            }

            else if(indice.tipo==='SMS'){

                if(datiEmail.arrayEventi && datiEmail.arrayUtenti){

                    let linkPartecipa = 'http://omceoce.ak12srl.it/switchForEmail?confermato=true&eliminato=false&idUtente='+datiEmail.arrayUtenti._id+'&idEvento='+datiEmail.arrayEventi._id+'&tb_notifica='+datiTab.tb_notifiche;

                    let linkDeclina = 'http://omceoce.ak12srl.it/switchForEmail?confermato=false&eliminato=true&idUtente='+datiEmail.arrayUtenti._id+'&idEvento='+datiEmail.arrayEventi._id+'&tb_notifica='+datiTab.tb_notifiche;

                    let link = [];

                    let googl = require('goo.gl');

                    googl.setKey('AIzaSyDKnbwfdHhc9qaPTyMuPO53mES20-PwJB4');

                    googl.getKey();

                    googl.shorten(linkPartecipa)
                        .then(function (shortUrl) {
                           link.push(shortUrl);
                            googl.shorten(linkDeclina)
                                .then(function (shortUrl) {
                                    link.push(shortUrl);
                                    const options = {
                                        url: 'https://app.mobyt.it/API/v1.0/REST/sms',
                                        method: 'POST',
                                        headers: {'user_key': '18443', 'Access_token': 'nZVc7WglBBWHy9eD6bGslST7'},

                                        json: true,
                                        body: {
                                            "recipient": ["+39"+datiEmail.arrayUtenti.numero_telefono],
                                            "message": datiTab.descrizione.toUpperCase() + "\n" +
                                            "Sei stato invitato ad un nuovo Evento! " +
                                            "Titolo: "+datiEmail.arrayEventi.titolo +
                                            " Sottotitolo: "+datiEmail.arrayEventi.sottotitolo +"\n"+
                                            "Partecipa --->"+link[0]+" Declina --->"+link[1],
                                            "message_type": "N",
                                            "sender": "+393458184794"
                                        }
                                    };
                                    const options1 = {
                                        url: 'http://localhost:3000/checkNotifica',
                                        method: 'POST',
                                        headers: {
                                            'Accept': 'application/json',
                                            'Accept-Charset': 'utf-8'
                                        },
                                        json: true,
                                        body: {"_id_utente":indice._id_utente, "_id_evento":indice._id_evento,  "tb_notifica": datiTab.tb_notifiche}
                                    };

                                    setTimeout(function () {

                                        request(options, function (error, responseMeta, response) {
                                            if (!error && responseMeta.statusCode === 201) {
                                                request(options1, function (error, response, body) {
                                                    if (!error && response.statusCode === 200) {
                                                        client.end();
                                                    }
                                                })
                                            }
                                        })

                                    },3000);
                                })
                                .catch(function (err) {
                                    console.error(err.message);
                                });
                        })
                        .catch(function (err) {
                            console.error(err.message);
                        });

                }

            }

        });

    });

}


router.post('/',function (req, res, next) {
    var client = connectionPostgres();
    let datiTab = req.body;

    let queryPostInvio = "SELECT A.mail, A.token, A.numero_telefono, B._id_utente, B._id_evento, C.titolo, B.data_invio, B.tipo, B.stato, B.confermato, B.eliminato, B._id \n" +
        "FROM "+datiTab.tb_contatti+" A INNER JOIN "+datiTab.tb_notifiche+" B ON A._id=B._id_utente \n" +
        "INNER JOIN "+datiTab.tb_eventi+" C ON C._id=B._id_evento where B.stato=false LIMIT 100";

    const query = client.query(queryPostInvio);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        let myOjb = JSON.stringify(result.rows, null, "    ");
        let final = JSON.parse(myOjb);
        if(final.length===0){
            res.json({"Nessuno da Notificare":true});
        }
        switchInvio(final,datiTab);
    });

    query.on('error', function(err) {
        console.error(err.stack);
    });

    res.json({"success":true});

});

module.exports = router;