let  util = require('util');
let  lodash = require('lodash');
let multiUser = require('../config/configMultiUser');



module.exports = function (app) {

    app.get('/', function (req, res, next) {
        res.render('login');
    });

    app.get('/home', function (req, res, next) {
        let  mutiOrg = lodash.filter(multiUser.data, { 'cod_org': req.session.cod_org } );
        res.render('index', { name: mutiOrg[0].descrizione });
    });

    app.get('/assegnaEvento', function (req, res, next) {
        res.render('assegnaEvento');
    });

    app.get('/gestioneNotifiche', function (req, res, next) {
        res.render('gestioneNotifiche');
    });

    app.get('/gestioneEventi', function (req, res, next) {
        res.render('gestioneEventi');
    });

    app.get('/gestioneNote', function (req, res, next) {
        res.render('gestioneNote');
    });

    app.get('/gestioneContatto', function (req, res, next) {
        res.render('gestioneContatto');
    });

    app.get('/declinato', function (req, res, next) {
        res.render('declinato');
    });

    app.get('/partecipato', function (req, res, next) {
        res.render('partecipato');
    });

    app.get('/gestioneInteressi', function (req, res, next) {
        res.render('gestioneInteressi');
    });

    app.get('/chatOperatoreSMS', function (req, res, next) {
        let  mutiOrg = lodash.filter(multiUser.data, { 'cod_org': req.session.cod_org } );
        res.render('chatOperatoreSMS', { name: mutiOrg[0].descrizione });
    });

    app.post('/', function (req, res, next) {

        if (req.body.userAuthenticated && req.body.userAuthenticated === true) {
            req.session.authenticated = true;
            res.redirect('/home');
        }

    });

    app.get('/logout', function (req, res, next) {
        delete req.session.authenticated;
        res.redirect('/');
    });

};