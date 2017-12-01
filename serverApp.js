var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var now = require('moment');

var postgres = require("./config/postgres");

var index = require('./routes/index');
var creaEvento = require('./routes/creaEvento');
var assegnaEvento = require('./routes/assegnaEvento');
var gestioneNotifiche = require('./routes/gestioneNotifiche');
var aggiungiContatto = require('./routes/aggiungiContatto');
var salvaEvento = require('./app/routes/salvaEvento');
var getEventi  = require('./app/routes/getEventi');
var cercaMatricola  = require('./app/routes/cercaMatricola');
var getMedici = require('./app/routes/getMedici');
var salvaContatto = require('./app/routes/salvaContatto');

var app = express();
var con = postgres(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(cookieParser());
app.use(require('less-middleware')(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

//
//app.all('/server/*', function (req, res) {
//
//    var forwardPath = '/';
//    req.url = forwardPath + req.url.split('/').slice(2).join('/'); // rimuove '/webhospital/';
//    var proxyOptions = {host: 'localhost', port: 3009};
//    return proxy.proxyRequest(req, res, proxyOptions);
//});

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', index);
app.use('/home', index);
app.use('/creaEvento', creaEvento);
app.use('/salvaEvento', salvaEvento);
app.use('/assegnaEvento', assegnaEvento);
app.use('/getEventi', getEventi);
app.use('/cercaMatricola', cercaMatricola);
app.use('/getMedici', getMedici);
app.use('/gestioneNotifiche', gestioneNotifiche);
app.use('/aggiungiContatto', aggiungiContatto);
app.use('/salvaContatto', salvaContatto);


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
