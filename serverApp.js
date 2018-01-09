var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var now = require('moment');
var session = require('express-session');

var postgres = require("./config/postgres");

var salvaEvento = require('./app/routes/salvaEvento');
var getEventi  = require('./app/routes/getEventi');
var cercaMatricola  = require('./app/routes/cercaMatricola');
var getMedici = require('./app/routes/getMedici');
var getRisposte = require('./app/routes/getRisposte');
var salvaContatto = require('./app/routes/salvaContatto');
var salvaToken = require('./app/routes/salvaToken');
var getEventiById = require('./app/routes/getEventiById');
var salvaStatoNotifiche = require('./app/routes/salvaStatoNotifiche');
var getNotifiche = require('./app/routes/getNotifiche');
var setEliminatoConfermato = require('./app/routes/setEliminatoConfermato');
var getUpdateEventi = require('./app/routes/getUpdateEventi');
var authRegister = require('./app/routes/authRegister');
var getMediciEmail = require('./app/routes/getMediciEmail');
var getMediciPec = require('./app/routes/getMediciPec');
var getMediciSms = require('./app/routes/getMediciSms');
var sendEmail = require('./app/routes/sendEmail');
var salvaStatoEmail = require('./app/routes/salvaStatoEmail');
var getNotificheEmail = require('./app/routes/getNotificheEmail');
var sendSms = require('./app/routes/sendSms');
var getNotificheSms = require('./app/routes/getNotificheSms');
var getDeleteEventi = require('./app/routes/getDeleteEventi');
var postGetEventi = require('./app/routes/postGetEventi');



var app = express();
var con = postgres(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
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

    if ((req.url === '/home'|| req.url === '/creaEvento' || req.url === '/assegnaEvento' || req.url === '/gestioneNotifiche' || req.url === '/modificaEvento' || req.url === '/aggiungiContatto' || req.url === '/gestioneApp' || req.url === '/gestioneEmail' || req.url === '/tabEmail' || req.url === '/tabSms' || req.url === '/gestioneSms')
        && (!req.session || !req.session.authenticated)) {
        res.render('login', { status: 403 });
        return;
    }

    next();
}

app.use(checkAuth);

require('./routes/routes.js')(app);

app.use('/salvaEvento', salvaEvento);
app.use('/getEventi', getEventi);
app.use('/cercaMatricola', cercaMatricola);
app.use('/getMedici', getMedici);
app.use('/getRisposte', getRisposte);
app.use('/salvaContatto', salvaContatto);
app.use('/salvaToken', salvaToken);
app.use('/getEventiById', getEventiById);
app.use('/salvaStatoNotifiche',salvaStatoNotifiche);
app.use('/getNotifiche',getNotifiche);
app.use('/setEliminatoConfermato',setEliminatoConfermato);
app.use('/getUpdateEventi',getUpdateEventi);
app.use('/authRegister',authRegister);
app.use('/getMediciPec',getMediciPec);
app.use('/getMediciSms',getMediciSms);
app.use('/getMediciEmail',getMediciEmail);
app.use('/sendEmail',sendEmail);
app.use('/salvaStatoEmail',salvaStatoEmail);
app.use('/getNotificheEmail',getNotificheEmail);
app.use('/sendSms',sendSms);
app.use('/getNotificheSms',getNotificheSms);
app.use('/getDeleteEventi',getDeleteEventi);
app.use('/postGetEventi',postGetEventi);


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
