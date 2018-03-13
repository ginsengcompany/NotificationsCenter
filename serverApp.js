let  express = require('express');
let  path = require('path');
let  favicon = require('serve-favicon');
let  logger = require('morgan');
let  cookieParser = require('cookie-parser');
let  bodyParser = require('body-parser');
let  moment = require('moment');
let  session = require('express-session');
let  cron = require('node-cron');
let  request = require('request');
let  mySqlConnection = require('./config/RIMdatabase');


let  salvaEvento = require('./app/routes/webApplication/salvaEvento');
let  getEventi  = require('./app/routes/webApplication/getEventi');
let  cercaUsername  = require('./app/routes/mobileApplication/cercaUsername');
let  getUtenti = require('./app/routes/webApplication/getUtenti');
let  salvaContatto = require('./app/routes/webApplication/salvaContatto');
let  getEventiById = require('./app/routes/mobileApplication/getEventiById');
let  salvaStatoNotifiche = require('./app/routes/webApplication/salvaStatoNotifiche');
let  getNotifiche = require('./app/routes/webApplication/getNotifiche');
let  setEliminatoConfermato = require('./app/routes/mobileApplication/setEliminatoConfermato');
let  getUpdateEventi = require('./app/routes/webApplication/getUpdateEventi');
let  authRegister = require('./app/routes/webApplication/authRegister');
let  getUtentiEmailSms = require('./app/routes/webApplication/getUtentiEmailSms');
let  getUtentiToken = require('./app/routes/webApplication/getUtentiToken');
let  getUtentiSms = require('./app/routes/webApplication/getUtentiSms');
let  sendEmail = require('./app/routes/webApplication/sendEmail');
let  getDeleteEventi = require('./app/routes/webApplication/getDeleteEventi');
let  switchConfermatoEmail = require('./app/routes/webApplication/switchConfermatoEmail');
let  getUtentiTokenSms = require('./app/routes/webApplication/getUtentiTokenSms');
let  getUtentiEmail = require('./app/routes/webApplication/getUtentiEmail');
let  getUtentiTokenEmail = require('./app/routes/webApplication/getUtentiTokenEmail');
let  getUtentiEmailToken = require('./app/routes/webApplication/getUtentiEmailToken');
let  getUtentiSmsToken = require('./app/routes/webApplication/getUtentiSmsToken');
let  getUtentiSmsEmail = require('./app/routes/webApplication/getUtentiSmsEmail');
let  getDeleteUtenti = require('./app/routes/webApplication/getDeleteUtenti');
let  getUpdateUtenti = require('./app/routes/webApplication/getUpdateUtenti');
let  getUtentiNotNotifica = require('./app/routes/webApplication/getUtentiNotNotifica');
let  switchForEmail = require('./app/routes/webApplication/switchForEmail');
let  invioNotifica = require('./app/routes/webApplication/invioNotifica');
let  checkNotifica = require('./app/routes/webApplication/checkNotifica');
let  getCountNotifiche = require('./app/routes/webApplication/getCountNotifiche');
let  getListaOrganizzazione = require('./app/routes/mobileApplication/getListaOrganizzazione');
let  getNotificheMaster = require('./app/routes/mobileApplication/getNotificheMaster');
let  prelievoInvioXML = require('./app/routes/webApplication/prelievoInvioXML');
let  loginMaster = require('./app/routes/mobileApplication/loginMaster');
let  getEventiMaster = require('./app/routes/mobileApplication/getEventiMaster');
let  getListaPartecipantiMaster = require('./app/routes/mobileApplication/getListaPartecipantiMaster');
let  getListaDeclinatiMaster = require('./app/routes/mobileApplication/getListaDeclinatiMaster');
let  gestioneConfermeSMS = require('./app/routes/webApplication/gestioneConfermeSMS');
let  deleteFileSuccess = require('./app/routes/webApplication/deleteFileSuccess');
let  getInteressi = require('./app/routes/webApplication/getInteressi');
let  getAddInteressi = require('./app/routes/webApplication/getAddInteressi');
let  getUpdateInteressi = require('./app/routes/webApplication/getUpdateInteressi');
let  getDeleteInteressi = require('./app/routes/webApplication/getDeleteInteressi');
let getNota = require('./app/routes/webApplication/getNota');
let salvaNota = require('./app/routes/webApplication/salvaNota');
let getUpdateNota = require('./app/routes/webApplication/getUpdateNota');
let getNotificheNota = require('./app/routes/webApplication/getNotificheNota');



let  app = express();

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

    if ((req.url === '/home'|| req.url === '/assegnaEvento' || req.url === '/gestioneNotifiche' || req.url === '/gestioneEventi' || req.url === '/gestioneContatto' || req.url === '/chatOperatoreSMS' || req.url === '/gestioneInteressi')
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

/*cron.schedule('40 *!/1 * * * *', function(){

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
            let  data = [];
            data.push(body);
            let  contaTot = JSON.parse(data[0]);
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
});*/

/*cron.schedule('15 *!/1 * * * *', function(){

    if(mySqlConnection.state === 'authenticated') {

        const options = {
            url: 'http://localhost:3000/prelievoInvioXML',
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Accept-Charset': 'utf-8'
            }
        };

        request(options, function (error, response, body) {
            if (!error && response.statusCode == 200) {

            }
        })

    }else{
        console.log('Connessione Persa');
    }
});

cron.schedule('* 01-05 * * *', function(){


        if(mySqlConnection.state === 'authenticated') {

            const options = {
                url: 'http://localhost:3000/gestioneConfermeSMS',
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Accept-Charset': 'utf-8'
                }
            };

            request(options, function (error, response, body) {
                if (!error && response.statusCode == 200) {

                }
            })

        }else{
            console.log('Connessione Persa');
        }

});

cron.schedule('0 0 0 * * *', function(){

    const options = {
        url: 'http://localhost:3000/deleteFileSuccess',
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Accept-Charset': 'utf-8'
        }
    };

    request(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {

        }
    })


});*/


require('./routes/routes.js')(app);

app.use('/salvaEvento', salvaEvento);
app.use('/getEventi', getEventi);
app.use('/cercaUsername', cercaUsername);
app.use('/getUtenti', getUtenti);
app.use('/salvaContatto', salvaContatto);
app.use('/getEventiById', getEventiById);
app.use('/salvaStatoNotifiche',salvaStatoNotifiche);
app.use('/getNotifiche',getNotifiche);
app.use('/setEliminatoConfermato',setEliminatoConfermato);
app.use('/getUpdateEventi',getUpdateEventi);
app.use('/authRegister',authRegister);
app.use('/getUtentiSms',getUtentiSms);
app.use('/getUtentiEmailSms',getUtentiEmailSms);
app.use('/sendEmail',sendEmail);
app.use('/getDeleteEventi',getDeleteEventi);
app.use('/switchConfermatoEmail',switchConfermatoEmail);
app.use('/getUtentiToken',getUtentiToken);
app.use('/getUtentiTokenSms',getUtentiTokenSms);
app.use('/getUtentiEmail',getUtentiEmail);
app.use('/getUtentiTokenEmail',getUtentiTokenEmail);
app.use('/getUtentiEmailToken',getUtentiEmailToken);
app.use('/getUtentiSmsToken',getUtentiSmsToken);
app.use('/getUtentiSmsEmail',getUtentiSmsEmail);
app.use('/getDeleteUtenti',getDeleteUtenti);
app.use('/getUpdateUtenti',getUpdateUtenti);
app.use('/getUtentiNotNotifica',getUtentiNotNotifica);
app.use('/switchForEmail',switchForEmail);
app.use('/invioNotifica',invioNotifica);
app.use('/checkNotifica',checkNotifica);
app.use('/getCountNotifiche',getCountNotifiche);
app.use('/getListaOrganizzazione',getListaOrganizzazione);
app.use('/getNotificheMaster',getNotificheMaster);
app.use('/prelievoInvioXML',prelievoInvioXML);
app.use('/loginMaster',loginMaster);
app.use('/getEventiMaster',getEventiMaster);
app.use('/getListaPartecipantiMaster',getListaPartecipantiMaster);
app.use('/getListaDeclinatiMaster',getListaDeclinatiMaster);
app.use('/gestioneConfermeSMS',gestioneConfermeSMS);
app.use('/deleteFileSuccess',deleteFileSuccess);
app.use('/getInteressi',getInteressi);
app.use('/getAddInteressi',getAddInteressi);
app.use('/getUpdateInteressi',getUpdateInteressi);
app.use('/getDeleteInteressi',getDeleteInteressi);
app.use('/getNota',getNota);
app.use('/salvaNota',salvaNota);
app.use('/getUpdateNota',getUpdateNota);
app.use('/getNotificheNota',getNotificheNota);



app.use(function (req, res, next) {

    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});

app.use(function(req, res, next) {
    let  err = new Error('Not Found');
    err.status = 404;
    res.render('error');
    next(err);
});

if (app.get('env') === 'development') {
    app.use(function(err, req, res) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

app.use(function(err, req, res) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
