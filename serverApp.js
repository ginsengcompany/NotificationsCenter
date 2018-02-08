var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var moment = require('moment');
var session = require('express-session');
var cron = require('node-cron');
var request = require('request');


var postgres = require("./config/postgres");

var salvaEvento = require('./app/routes/webApplication/salvaEvento');
var getEventi  = require('./app/routes/webApplication/getEventi');
var cercaMatricola  = require('./app/routes/mobileApplication/cercaMatricola');
var getMedici = require('./app/routes/webApplication/getMedici');
var salvaContatto = require('./app/routes/webApplication/salvaContatto');
var getEventiById = require('./app/routes/mobileApplication/getEventiById');
var salvaStatoNotifiche = require('./app/routes/webApplication/salvaStatoNotifiche');
var getNotifiche = require('./app/routes/webApplication/getNotifiche');
var setEliminatoConfermato = require('./app/routes/mobileApplication/setEliminatoConfermato');
var getUpdateEventi = require('./app/routes/webApplication/getUpdateEventi');
var authRegister = require('./app/routes/webApplication/authRegister');
var getMediciEmailSms = require('./app/routes/webApplication/getMediciEmailSms');
var getMediciToken = require('./app/routes/webApplication/getMediciToken');
var getMediciSms = require('./app/routes/webApplication/getMediciSms');
var sendEmail = require('./app/routes/webApplication/sendEmail');
var getDeleteEventi = require('./app/routes/webApplication/getDeleteEventi');
var switchConfermatoEmail = require('./app/routes/webApplication/switchConfermatoEmail');
var getMediciTokenSms = require('./app/routes/webApplication/getMediciTokenSms');
var getMediciEmail = require('./app/routes/webApplication/getMediciEmail');
var getMediciTokenEmail = require('./app/routes/webApplication/getMediciTokenEmail');
var getMediciEmailToken = require('./app/routes/webApplication/getMediciEmailToken');
var getMediciSmsToken = require('./app/routes/webApplication/getMediciSmsToken');
var getMediciSmsEmail = require('./app/routes/webApplication/getMediciSmsEmail');
var getDeleteMedici = require('./app/routes/webApplication/getDeleteMedici');
var getUpdateMedici = require('./app/routes/webApplication/getUpdateMedici');
var getMediciNotNotifica = require('./app/routes/webApplication/getMediciNotNotifica');
var switchForEmail = require('./app/routes/webApplication/switchForEmail');
var invioNotifica = require('./app/routes/webApplication/invioNotifica');
var checkNotifica = require('./app/routes/webApplication/checkNotifica');
var getCountNotifiche = require('./app/routes/webApplication/getCountNotifiche');
var getListaOrganizzazione = require('./app/routes/mobileApplication/getListaOrganizzazione');
var getNotificheMaster = require('./app/routes/mobileApplication/getNotificheMaster');


var app = express();
var con = postgres(app);

moment.locale('it');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname,'public/images','favicon.ico')));

app.use(logger('dev'));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(session({secret: "Shh, its a secret!"}));

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());


function checkAuth (req, res, next) {

    if ((req.url === '/home'|| req.url === '/creaEvento' || req.url === '/assegnaEvento' || req.url === '/gestioneNotifiche' || req.url === '/modificaEvento' || req.url === '/aggiungiContatto' || req.url === '/modificaContatto')
        && (!req.session || !req.session.authenticated)) {
        res.render('login', { status: 403 });
        return;
    }

    if(req.body.cod_org){
        req.session.cod_org = req.body.cod_org;
    }

    next();
}

app.use(checkAuth);

cron.schedule('*!/1 * * * *', function(){

    const options = {
        url: 'http://localhost:3000/getCountNotifiche',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = [];
            data.push(body);
            var contaTot = JSON.parse(data[0]);
            if(parseInt(contaTot.count)>0){
                request({
                    url: 'http://localhost:3000/invioNotifica',
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Accept-Charset': 'utf-8'
                    },
                    json: true,
                    body: contaTot
                }, function (error, response, body) {
                    if (!error && response.statusCode == 200) {

                    }else{
                        console.log('Errore');
                    }
                })
            }
            else {

            }
        }
    })
});

require('./routes/routes.js')(app);

app.use('/salvaEvento', salvaEvento);
app.use('/getEventi', getEventi);
app.use('/cercaMatricola', cercaMatricola);
app.use('/getMedici', getMedici);
app.use('/salvaContatto', salvaContatto);
app.use('/getEventiById', getEventiById);
app.use('/salvaStatoNotifiche',salvaStatoNotifiche);
app.use('/getNotifiche',getNotifiche);
app.use('/setEliminatoConfermato',setEliminatoConfermato);
app.use('/getUpdateEventi',getUpdateEventi);
app.use('/authRegister',authRegister);
app.use('/getMediciSms',getMediciSms);
app.use('/getMediciEmailSms',getMediciEmailSms);
app.use('/sendEmail',sendEmail);
app.use('/getDeleteEventi',getDeleteEventi);
app.use('/switchConfermatoEmail',switchConfermatoEmail);
app.use('/getMediciToken',getMediciToken);
app.use('/getMediciTokenSms',getMediciTokenSms);
app.use('/getMediciEmail',getMediciEmail);
app.use('/getMediciTokenEmail',getMediciTokenEmail);
app.use('/getMediciEmailToken',getMediciEmailToken);
app.use('/getMediciSmsToken',getMediciSmsToken);
app.use('/getMediciSmsEmail',getMediciSmsEmail);
app.use('/getDeleteMedici',getDeleteMedici);
app.use('/getUpdateMedici',getUpdateMedici);
app.use('/getMediciNotNotifica',getMediciNotNotifica);
app.use('/switchForEmail',switchForEmail);
app.use('/invioNotifica',invioNotifica);
app.use('/checkNotifica',checkNotifica);
app.use('/getCountNotifiche',getCountNotifiche);
app.use('/getListaOrganizzazione',getListaOrganizzazione);
app.use('/getNotificheMaster',getNotificheMaster);


app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}


app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
