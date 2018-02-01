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

var salvaEvento = require('./app/routes/salvaEvento');
var getEventi  = require('./app/routes/getEventi');
var cercaMatricola  = require('./app/routes/cercaMatricola');
var getMedici = require('./app/routes/getMedici');
var salvaContatto = require('./app/routes/salvaContatto');
var salvaToken = require('./app/routes/salvaToken');
var getEventiById = require('./app/routes/getEventiById');
var salvaStatoNotifiche = require('./app/routes/salvaStatoNotifiche');
var getNotifiche = require('./app/routes/getNotifiche');
var setEliminatoConfermato = require('./app/routes/setEliminatoConfermato');
var getUpdateEventi = require('./app/routes/getUpdateEventi');
var authRegister = require('./app/routes/authRegister');
var getMediciEmailSms = require('./app/routes/getMediciEmailSms');
var getMediciToken = require('./app/routes/getMediciToken');
var getMediciSms = require('./app/routes/getMediciSms');
var sendEmail = require('./app/routes/sendEmail');
var getDeleteEventi = require('./app/routes/getDeleteEventi');
var switchConfermatoEmail = require('./app/routes/switchConfermatoEmail');
var getMediciTokenSms = require('./app/routes/getMediciTokenSms');
var getMediciEmail = require('./app/routes/getMediciEmail');
var getMediciTokenEmail = require('./app/routes/getMediciTokenEmail');
var getMediciEmailToken = require('./app/routes/getMediciEmailToken');
var getMediciSmsToken = require('./app/routes/getMediciSmsToken');
var getMediciSmsEmail = require('./app/routes/getMediciSmsEmail');
var getDeleteMedici = require('./app/routes/getDeleteMedici');
var getUpdateMedici = require('./app/routes/getUpdateMedici');
var getMediciNotNotifica = require('./app/routes/getMediciNotNotifica');
var switchForEmail = require('./app/routes/switchForEmail');
var invioNotifica = require('./app/routes/invioNotifica');
var checkNotifica = require('./app/routes/checkNotifica');
var getCountNotifiche = require('./app/routes/getCountNotifiche');


var app = express();
var con = postgres(app);

moment.locale('it');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname,'public/images','centerLogo.svg')));

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

    const options1 = {
        url: 'http://localhost:3000/invioNotifica',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            if(parseInt(body)>0){
                request(options1, function (error, response, body) {
                    if (!error && response.statusCode == 200) {

                    }else{
                        console.log('Errore');
                    }
                })
            }
            else {
                //console.log('Nessuno da Notificare');
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
app.use('/salvaToken', salvaToken);
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



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
