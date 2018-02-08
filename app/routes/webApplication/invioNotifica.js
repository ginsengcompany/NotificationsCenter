var express = require('express');
var router = express.Router();
var postgresConnection = require('../../../config/postgres');
var moment = require('moment');
var request = require('request');
var path = require('path');

var connectionPostgres = function () {
    return postgresConnection();
};

var client = connectionPostgres();

var datiEmail = {
    "to":undefined,
    "subject":undefined,
    "html": undefined,
    "arrayEventi" : undefined,
    "arrayMedici" : undefined,
    "tb_notifica" : undefined
};

function switchInvio(final,datiTab){
        for(var i=0;i<final.length;i++){
            posyQuery(final[i],datiTab);
        }
}

function posyQuery(indice,datiTab) {

    queryPostEvento = "SELECT * FROM "+datiTab.tb_eventi+" WHERE _id="+indice._id_evento;
    queryPostMedico = "SELECT * FROM "+datiTab.tb_contatti+" WHERE _id="+indice._id_medico;

    const query1 = client.query(queryPostEvento);

    query1.on("row", function (row, result) {
        result.addRow(row);
        var myOjb = JSON.stringify(result.rows, null, "    ");
        datiEmail.arrayEventi = JSON.parse(myOjb)[0];

        const query2 = client.query(queryPostMedico);

        query2.on("row", function (row, result) {
            result.addRow(row);
            var myOjb = JSON.stringify(result.rows, null, "    ");
            datiEmail.arrayMedici = JSON.parse(myOjb)[0];

            if(indice.tipo==='Push Notifications'){

                if(datiEmail.arrayEventi && datiEmail.arrayMedici){
                    var restKey = 'OTM3ZGZiOGUtZjNiYS00YTAxLWFjYmMtMDRjN2I2NjE5MWE2';
                    var appID = 'b560b667-aa97-4980-a740-c8fc7925e208';
                    var message = 'Hai un nuovo Evento entra subito nell`app per scoprire!';
                    var device  = datiEmail.arrayMedici.token;

                    const options = {
                        method:'POST',
                        uri:'https://onesignal.com/api/v1/notifications',
                        headers: {
                            "authorization": "Basic "+restKey,
                            "content-type": "application/json"
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
                        body: {"_id_medico":indice._id_medico, "_id_evento":indice._id_evento, "tb_notifica": datiTab.tb_notifiche}
                    };

                    setTimeout(function () {

                        request(options, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                request(options1, function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        client.end();
                                    }
                                })
                            }
                        })

                    },3000);

                }

            }

            else if(indice.tipo==='E-mail'){

                if(datiEmail.arrayEventi && datiEmail.arrayMedici){
                    datiEmail.to = indice.mail;
                    datiEmail.tb_notifica = datiTab.tb_notifiche;
                    datiEmail.subject = "Notifications - Center , Hai un nuovo Evento leggi subito per scoprire!";

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
                        body: {"_id_medico":indice._id_medico, "_id_evento":indice._id_evento,  "tb_notifica": datiTab.tb_notifiche}
                    };

                    setTimeout(function () {

                        request(options, function (error, response, body) {
                            if (!error && response.statusCode == 200) {
                                request(options1, function (error, response, body) {
                                    if (!error && response.statusCode == 200) {
                                        client.end();
                                    }
                                })
                            }
                        })

                    },3000);


                }

            }

            else if(indice.tipo==='SMS'){

            }

        });

    });

}

router.post('/',function (req, res, next) {

   var datiTab = req.body;

    var queryPostInvio = "SELECT A.mail, A.token, A.numero_telefono, B._id_medico, B._id_evento, C.titolo, B.data_invio, B.tipo, B.stato, B.confermato, B.eliminato, B._id \n" +
        "FROM "+datiTab.tb_contatti+" A INNER JOIN "+datiTab.tb_notifiche+" B ON A._id=B._id_medico \n" +
        "INNER JOIN "+datiTab.tb_eventi+" C ON C._id=B._id_evento where B.stato=false LIMIT 100";

    const query = client.query(queryPostInvio);
    query.on("row", function (row, result) {
        result.addRow(row);
    });
    query.on("end", function (result) {
        var myOjb = JSON.stringify(result.rows, null, "    ");
        var final = JSON.parse(myOjb);
        if(final.length===0){
            res.json({"Nessuno da Notificare":true});
        }
        switchInvio(final,datiTab);
    });

    res.json({"success":true});

});

module.exports = router;