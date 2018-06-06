let nodemailer = require('nodemailer');
let express = require('express');
let router = express.Router();
let postgresConnection = require('../../../config/postgres');
let config = require('../../../config/configServiceEmail');
let moment = require('moment');
moment.locale('it');

let connectionPostgres = function () {
    return postgresConnection();
};

router.post('/',function (req, res, next) {
    let datiEmail = req.body;

    let transporter = nodemailer.createTransport({
        service: config.serviceEmail.service,
        auth: {
            user: config.serviceEmail.user,
            pass: config.serviceEmail.pass
        }
    });

    let html = '';

    if(req.body.chiamante === 'CUPT'){

        html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
            '<html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>'+
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
            '<title></title>'+
            '<meta name="viewport" content="width=device-width" /><style type="text/css">'+
            '@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:64px !important;line-height:63px !important}.wrapper h2{}.wrapper h2{font-size:30px !important;line-height:38px !important}.wrapper h3{}.wrapper h3{font-size:22px !important;line-height:31px !important}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px'+
            '!important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper'+
            '.size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}'+
            '</style>'+
            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>' +
            '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>' +
            '<link href="stylesheets/emailTemplate.css" rel="stylesheet" type="text/css">'+
            '<style type="text/css">'+
            'body{background-color:#fff}.logo a:hover,.logo a:focus{color:#859bb1 !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:64px !important;line-height:63px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:30px !important;line-height:38px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:22px !important;line-height:31px !important}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:sans-serif}'+
            '</style>'+
            '<meta name="robots" content="noindex,nofollow" />'+
            '<meta property="og:title" content="My First Campaign" />'+
            '</head>'+
            '<body class="mso">'+
            '<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">'+
            '<table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>'+
            '<div role="banner">'+
            '<div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">'+
            '<div style="border-collapse: collapse;display: table;width: 100%;">'+
            '<div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #adb3b9;font-family: sans-serif;">'+
            '</div>'+
            '<div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #adb3b9;font-family: sans-serif;">'+

            '</div>'+

            '</div>'+
            '</div>'+
            '<div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">'+
            '<div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">'+
            '<div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 560px;" src="http://omceoce.ak12srl.it/images/intestazionemail.png" alt="" width="560" /></div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div role="section">'+
            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong></strong>'+datiEmail.titolo+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong></strong>'+datiEmail.sottotitolo+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<a style="border-radius: 3px;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: green;font-family: Georgia, serif;" href="'+datiEmail.link+'">Reimposta Password</a>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+


            '<div style="mso-line-height-rule: exactly;" role="contentinfo">'+
            '<div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">'+
            '<div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">'+
            '<div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">'+
            '<table class="email-footer__links emb-web-links" style="border-collapse: collapse;table-layout: fixed;" role="presentation"><tbody><tr role="navigation">'+
            '<td class="emb-web-links" style="padding: 0;width: 26px;"><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #adb3b9;" href=""><img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook" /></a></td><td class="emb-web-links" style="padding: 0 0 0 3px;width: 26px;"><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #adb3b9;" href="http://www.ak12srl.it/"><img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website" /></a></td>'+
            '</tr></tbody></table>'+
            '<div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">'+
            '<div>Notification Center 2018</div>'+
            '</div>'+
            '<div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">'+

            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div></td></tr></tbody></table>'+
            '</body>'+
            '</html>';

    }
    else{
        html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
            '<html style="margin: 0;padding: 0;" xmlns="http://www.w3.org/1999/xhtml"><!--<![endif]--><head>'+
            '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />'+
            '<title></title>'+
            '<meta name="viewport" content="width=device-width" /><style type="text/css">'+
            '@media only screen and (min-width: 620px){.wrapper{min-width:600px !important}.wrapper h1{}.wrapper h1{font-size:64px !important;line-height:63px !important}.wrapper h2{}.wrapper h2{font-size:30px !important;line-height:38px !important}.wrapper h3{}.wrapper h3{font-size:22px !important;line-height:31px !important}.column{}.wrapper .size-8{font-size:8px !important;line-height:14px !important}.wrapper .size-9{font-size:9px !important;line-height:16px !important}.wrapper .size-10{font-size:10px !important;line-height:18px !important}.wrapper .size-11{font-size:11px !important;line-height:19px !important}.wrapper .size-12{font-size:12px !important;line-height:19px !important}.wrapper .size-13{font-size:13px !important;line-height:21px !important}.wrapper .size-14{font-size:14px !important;line-height:21px !important}.wrapper .size-15{font-size:15px !important;line-height:23px'+
            '!important}.wrapper .size-16{font-size:16px !important;line-height:24px !important}.wrapper .size-17{font-size:17px !important;line-height:26px !important}.wrapper .size-18{font-size:18px !important;line-height:26px !important}.wrapper .size-20{font-size:20px !important;line-height:28px !important}.wrapper .size-22{font-size:22px !important;line-height:31px !important}.wrapper .size-24{font-size:24px !important;line-height:32px !important}.wrapper .size-26{font-size:26px !important;line-height:34px !important}.wrapper .size-28{font-size:28px !important;line-height:36px !important}.wrapper .size-30{font-size:30px !important;line-height:38px !important}.wrapper .size-32{font-size:32px !important;line-height:40px !important}.wrapper .size-34{font-size:34px !important;line-height:43px !important}.wrapper .size-36{font-size:36px !important;line-height:43px !important}.wrapper'+
            '.size-40{font-size:40px !important;line-height:47px !important}.wrapper .size-44{font-size:44px !important;line-height:50px !important}.wrapper .size-48{font-size:48px !important;line-height:54px !important}.wrapper .size-56{font-size:56px !important;line-height:60px !important}.wrapper .size-64{font-size:64px !important;line-height:63px !important}}'+
            '</style>'+
            '<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">' +
            '<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>' +
            '<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>' +
            '<link href="stylesheets/emailTemplate.css" rel="stylesheet" type="text/css">'+
            '<style type="text/css">'+
            'body{background-color:#fff}.logo a:hover,.logo a:focus{color:#859bb1 !important}.mso .layout-has-border{border-top:1px solid #ccc;border-bottom:1px solid #ccc}.mso .layout-has-bottom-border{border-bottom:1px solid #ccc}.mso .border,.ie .border{background-color:#ccc}.mso h1,.ie h1{}.mso h1,.ie h1{font-size:64px !important;line-height:63px !important}.mso h2,.ie h2{}.mso h2,.ie h2{font-size:30px !important;line-height:38px !important}.mso h3,.ie h3{}.mso h3,.ie h3{font-size:22px !important;line-height:31px !important}.mso .layout__inner,.ie .layout__inner{}.mso .footer__share-button p{}.mso .footer__share-button p{font-family:sans-serif}'+
            '</style>'+
            '<meta name="robots" content="noindex,nofollow" />'+
            '<meta property="og:title" content="My First Campaign" />'+
            '</head>'+
            '<body class="mso">'+
            '<body class="no-padding" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;">'+
            '<table class="wrapper" style="border-collapse: collapse;table-layout: fixed;min-width: 320px;width: 100%;background-color: #fff;" cellpadding="0" cellspacing="0" role="presentation"><tbody><tr><td>'+
            '<div role="banner">'+
            '<div class="preheader" style="Margin: 0 auto;max-width: 560px;min-width: 280px; width: 280px;width: calc(28000% - 167440px);">'+
            '<div style="border-collapse: collapse;display: table;width: 100%;">'+
            '<div class="snippet" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 140px; width: 140px;width: calc(14000% - 78120px);padding: 10px 0 5px 0;color: #adb3b9;font-family: sans-serif;">'+
            '</div>'+
            '<div class="webversion" style="display: table-cell;Float: left;font-size: 12px;line-height: 19px;max-width: 280px;min-width: 139px; width: 139px;width: calc(14100% - 78680px);padding: 10px 0 5px 0;text-align: right;color: #adb3b9;font-family: sans-serif;">'+

            '</div>'+

            '</div>'+
            '</div>'+
            '<div class="header" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);" id="emb-email-header-container">'+
            '<div class="logo emb-logo-margin-box" style="font-size: 26px;line-height: 32px;Margin-top: 6px;Margin-bottom: 20px;color: #c3ced9;font-family: Roboto,Tahoma,sans-serif;Margin-left: 20px;Margin-right: 20px;" align="center">'+
            '<div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 560px;" src="http://omceoce.ak12srl.it/images/intestazionemail.png" alt="" width="560" /></div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '<div role="section">'+
            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Titolo :&nbsp;</strong>'+datiEmail.arrayEventi.titolo+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Sottotitolo :&nbsp;</strong>'+datiEmail.arrayEventi.sottotitolo+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Data Inizio :&nbsp;</strong>'+moment(datiEmail.arrayEventi.data).format("DD MMMM YYYY")+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Data Fine :&nbsp;</strong>'+moment(datiEmail.arrayEventi.data_fine).format("DD MMMM YYYY")+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Luogo:&nbsp;</strong>'+datiEmail.arrayEventi.luogo+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Informazioni:&nbsp;</strong>'+datiEmail.arrayEventi.informazioni+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Descrizione:&nbsp;</strong>'+datiEmail.arrayEventi.descrizione+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Relatori:&nbsp;</strong>'+datiEmail.arrayEventi.relatori+'</p>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+

            '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
            '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

            '<div style="Margin-left: 20px;Margin-right: 20px;">'+
            '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
            '<a style="border-radius: 3px;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: green;font-family: Georgia, serif;" href="http://omceoce.ak12srl.it/switchForEmail?confermato=true&eliminato=false&idUtente='+datiEmail.arrayUtenti._id+'&idEvento='+datiEmail.arrayEventi._id+'&tb_notifica='+datiEmail.tb_notifica+'">Partecipa</a>'+
            '&nbsp;'+
            '<a style="border-radius: 3px;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: red;font-family: Georgia, serif;" href="http://omceoce.ak12srl.it/switchForEmail?confermato=false&eliminato=true&idUtente='+datiEmail.arrayUtenti._id+'&idEvento='+datiEmail.arrayEventi._id+'&tb_notifica='+datiEmail.tb_notifica+'">Declina</a>'+
            '</div>'+
            '</div>'+

            '</div>'+
            '</div>'+
            '</div>'+

            '<div style="mso-line-height-rule: exactly;line-height: 20px;font-size: 20px;">&nbsp;</div>'+


            '<div style="mso-line-height-rule: exactly;" role="contentinfo">'+
            '<div class="layout email-footer" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
            '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;">'+
            '<div class="column wide" style="text-align: left;font-size: 12px;line-height: 19px;color: #adb3b9;font-family: sans-serif;Float: left;max-width: 400px;min-width: 320px; width: 320px;width: calc(8000% - 47600px);">'+
            '<div style="Margin-left: 20px;Margin-right: 20px;Margin-top: 10px;Margin-bottom: 10px;">'+
            '<table class="email-footer__links emb-web-links" style="border-collapse: collapse;table-layout: fixed;" role="presentation"><tbody><tr role="navigation">'+
            '<td class="emb-web-links" style="padding: 0;width: 26px;"><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #adb3b9;" href=""><img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook" /></a></td><td class="emb-web-links" style="padding: 0 0 0 3px;width: 26px;"><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #adb3b9;" href="http://www.ak12srl.it/"><img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website" /></a></td>'+
            '</tr></tbody></table>'+
            '<div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">'+
            '<div>Notification Center 2018</div>'+
            '</div>'+
            '<div style="font-size: 12px;line-height: 19px;Margin-top: 18px;">'+

            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div>'+
            '</div></td></tr></tbody></table>'+
            '</body>'+
            '</html>';
    }



    let mailOptions = {
        from: config.serviceEmail.from,
        to: datiEmail.to,
        subject: datiEmail.subject,
        html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            return res.json(true);
        }
    });

});

module.exports = router;

