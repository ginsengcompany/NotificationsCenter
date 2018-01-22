var arrayMedici = {};
var arrayEventi = {};

$('#email').val('omceoce.ak12srl@gmail.com');
$('#password').val('omceoce.ak12');

$(function() {
    moment.locale('it');
    $('#invioPush').prop('checked',true);
    $('#invioEmail').prop('checked',true);
    $('#invioSms').prop('checked',false);
});

function render (data) {
    var date = new Date(data);
    var month = date.getMonth() + 1;
    return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
}

function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
        '<td>Data Fine:</td>'+
        '<td>'+render(d.data_fine)+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>Luogo:</td>'+
        '<td>'+d.luogo+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>Informazioni:</td>'+
        '<td>'+d.informazioni+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>Relatori:</td>'+
        '<td>'+d.relatori+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>Descrizione:</td>'+
        '<td>'+d.descrizione+'</td>'+
        '</tr>'+
        '</table>';
}

function getMediciNotNotifica (){

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    datiNotNotifica = {
        "idEvento" : arrayEventi[0]._id
    }

    tabMedici = $('#tabellaMedici').DataTable( {
        responsive: true,
        ajax: {
            type: 'POST',
            url: '/getMediciNotNotifica',
            data: datiNotNotifica
        },
        columns: [
            { "data": "_id", "visible": false },
            { "data": "matricola" },
            { "data": "cognome" },
            { "data": "nome" },
            { "data": "specializzazione" },
            { "data": "provincia" }
        ]
    } );

    $('#tabellaMedici tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );
}

$(document).ready(function() {

     tabEventi = $('#tabellaEventi').DataTable( {
        ajax: "/getEventi",
        responsive: true,
        ajaxSettings: {
            method: "GET",
            cache: false
        },
        columns: [
            {
                "className":      'details-control',
                "orderable":      false,
                "data":           null,
                "defaultContent": ''
            },
            { "data": "titolo" },
            { "data": "sottotitolo" },
            { "data": "luogo", "visible": false },
            { "data": "data" , "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
            }},
            { "data": "data_fine" , "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
            }, "visible": false},
            { "data": "informazioni", "visible": false },
            { "data": "relatori", "visible": false },
            { "data": "descrizione", "visible": false }

        ]
    } );

    $('#tabellaEventi tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('#tabellaMedici').dataTable().fnClearTable();
        }
        else {
            tabEventi.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#tabellaMedici').dataTable().fnDestroy();
            getMediciNotNotifica ();
        }
    } );

    $('#tabellaEventi tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tabEventi.row( tr );

        if ( row.child.isShown() ) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child( format(row.data()) ).show();
            tr.addClass('shown');
        }
    } );

});

function  selezionaTutti() {
    tabMedici.rows().select();
}

function deselezionaTutti(){
    tabMedici.rows().deselect();
}

function switchTable() {

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    datiNotNotifica = {
        "idEvento" : arrayEventi[0]._id
    }

    //token
    if($('#invioPush').prop('checked')===true && $('#invioEmail').prop('checked')===false && $('#invioSms').prop('checked')===false){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciToken',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }
    if($('#invioPush').prop('checked')===true && $('#invioEmail').prop('checked')===false && $('#invioSms').prop('checked')===true){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciTokenSms',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }
    if($('#invioPush').prop('checked')===true && $('#invioEmail').prop('checked')===true && $('#invioSms').prop('checked')===false){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciTokenEmail',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }

    //email
    if($('#invioPush').prop('checked')===false && $('#invioEmail').prop('checked')===true && $('#invioSms').prop('checked')===false){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciEmail',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }
    if($('#invioPush').prop('checked')===false && $('#invioEmail').prop('checked')===true && $('#invioSms').prop('checked')===true){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciEmailSms',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }
    if($('#invioPush').prop('checked')===true && $('#invioEmail').prop('checked')===true && $('#invioSms').prop('checked')===false){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciEmailToken',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }

    //sms
    if($('#invioPush').prop('checked')===false && $('#invioEmail').prop('checked')===false && $('#invioSms').prop('checked')===true){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciSms',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }
    if($('#invioPush').prop('checked')===true && $('#invioEmail').prop('checked')===false && $('#invioSms').prop('checked')===true){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciSmsToken',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }
    if($('#invioPush').prop('checked')===false && $('#invioEmail').prop('checked')===true && $('#invioSms').prop('checked')===true){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciSmsEmail',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }

    //all
    if($('#invioPush').prop('checked')===true && $('#invioEmail').prop('checked')===true && $('#invioSms').prop('checked')===true){
        $('#tabellaMedici').dataTable().fnDestroy();
        tabMedici = $('#tabellaMedici').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getMediciNotNotifica',
                data: datiNotNotifica
            },
            columns: [
                { "data": "_id", "visible": false },
                { "data": "matricola" },
                { "data": "cognome" },
                { "data": "nome" },
                { "data": "specializzazione" },
                { "data": "provincia" }
            ]
        } );
    }
    if($('#invioPush').prop('checked')===false && $('#invioEmail').prop('checked')===false && $('#invioSms').prop('checked')===false){
        $('#tabellaMedici').dataTable().fnClearTable();
    }

};

var successMessage = function(idMedico,idEvento,tipo){

    var successMessageDati = {
        "idMedico" : idMedico,
        "idEvento" : idEvento,
        "stato": true,
        "confermato": false,
        "eliminato": false,
        "tipo": tipo
    };

    $.ajax({
        url: '/salvaStatoNotifiche',
        type: 'POST',
        data: JSON.stringify(successMessageDati),
        cache: false,
        contentType: 'application/json',
        success: function(data) {
            if(data.errore===true){

                $("#myModal").on("show", function() {
                    $("#myModal a.btn").on("click", function(e) {
                        console.log("button pressed");
                        $("#myModal").modal('hide');
                    });
                });
                $("#myModal").on("hide", function() {
                    $("#myModal a.btn").off("click");
                });

                $("#myModal").on("hidden", function() {
                    $("#myModal").remove();
                });

                $("#myModal").modal({
                    "backdrop"  : "static",
                    "keyboard"  : true,
                    "show"      : true
                });
            }
            else{
                $(".progress-bar").animate({width: "100%"}, 2000);
                $("#myModal1").on("show", function() {
                    $("#myModal1 a.btn").on("click", function(e) {
                        console.log("button pressed");
                        $("#myModal1").modal('hide');
                    });
                });
                $("#myModal1").on("hide", function() {
                    $("#myModal1 a.btn").off("click");
                });

                $("#myModal1").on("hidden", function() {
                    $("#myModal1").remove();
                });

                $("#myModal1").modal({
                    "backdrop"  : "static",
                    "keyboard"  : true,
                    "show"      : true
                });
                $(".progress-bar").animate({width: "0%"}, 1000);
            }

        },
        faliure: function(data) {
            console.log('Errore!');
        }
    });

};

var sendMessage = function(device, message,idMedico,idEvento){
    var restKey = 'OTM3ZGZiOGUtZjNiYS00YTAxLWFjYmMtMDRjN2I2NjE5MWE2';
    var appID = 'b560b667-aa97-4980-a740-c8fc7925e208';

    $.ajax({
        url: 'https://onesignal.com/api/v1/notifications',
        type: 'POST',
        data: JSON.stringify({
            'app_id': appID,
            'small_icon' : 'icon',
            'large_icon' : 'icon',
            'contents': {en: message},
            'include_player_ids': Array.isArray(device) ? device : [device]
        }),
        cache: false,
        contentType: 'application/json',
        authorization: "Basic " + restKey,
        success: function(data) {
            var tipo = 'Push Notifications';
            successMessage(idMedico,idEvento,tipo);
            console.log(data);
        },
        faliure: function(data) {
            console.error('Error:', data.errors);
        }
    });
};

datiEmail = {

    "user":undefined,
    "pass":undefined,
    "from":undefined,
    "to":undefined,
    "subject":undefined,
    "text": undefined,
    "service":undefined,
    "html": undefined
};

function salvaDati(){

    var ids = $.map(tabMedici.rows('.selected').data(), function (item) {
        return item;
    });
    arrayMedici = ids;

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    for(var i=0; i<arrayMedici.length; i++){

        if(arrayMedici[i].token){

            sendMessage(arrayMedici[i].token, 'OMCEO - CASERTA , Hai un nuovo Evento entra subito nell`app per scoprire!',arrayMedici[i]._id,arrayEventi[0]._id);

        }
        else if(arrayMedici[i].mail){

            datiEmail.service = $('#service').val();
            datiEmail.user = $('#email').val();
            datiEmail.pass = $('#password').val();
            datiEmail.from = $('#email').val();
            datiEmail.to = arrayMedici[i].mail;
            datiEmail.subject = "OMCEO - CASERTA , Hai un nuovo Evento leggi subito per scoprire!";
            datiEmail.text = "Titolo: "+arrayEventi[0].titolo+" \n"+
                "Sottotitolo: "+arrayEventi[0].sottotitolo+" \n"+
                "Data inizio: "+arrayEventi[0].data+" \n"+
                "Data Fine: "+arrayEventi[0].data_fine+" \n"+
                "Luogo: "+arrayEventi[0].luogo+" \n"+
                "Informazioni: "+arrayEventi[0].informazioni+" \n"+
                "Relatori: "+arrayEventi[0].relatori+" \n"+
                "Descrizione: "+arrayEventi[0].descrizione+" \n";

            datiEmail.html = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">' +
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
                '<div class="logo-center" align="center" id="emb-email-header"><img style="display: block;height: auto;width: 100%;border: 0;max-width: 560px;" src="https://www.omceocaserta.it/wp-content/uploads/2015/09/logo-1.png" alt="" width="560" /></div>'+
                '</div>'+
            '</div>'+
            '</div>'+
            '<div role="section">'+
                '<div class="layout one-col fixed-width" style="Margin: 0 auto;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;">'+
                '<div class="layout__inner" style="border-collapse: collapse;display: table;width: 100%;background-color: #ffffff;">'+
                '<div class="column" style="text-align: left;color: #8e959c;font-size: 14px;line-height: 21px;font-family: sans-serif;max-width: 600px;min-width: 320px; width: 320px;width: calc(28000% - 167400px);">'+

                '<div style="Margin-left: 20px;Margin-right: 20px;">'+
                '<div style="mso-line-height-rule: exactly;mso-text-raise: 4px;">'+
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Titolo :&nbsp;</strong>'+arrayEventi[0].titolo+'</p>'+
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
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Sottotitolo :&nbsp;</strong>'+arrayEventi[0].sottotitolo+'</p>'+
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
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Data Inizio :&nbsp;</strong>'+moment(arrayEventi[0].data).format("DD MMMM YYYY")+'</p>'+
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
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Data Fine :&nbsp;</strong>'+moment(arrayEventi[0].data_fine).format("DD MMMM YYYY")+'</p>'+
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
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Luogo:&nbsp;</strong>'+arrayEventi[0].luogo+'</p>'+
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
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Informazioni:&nbsp;</strong>'+arrayEventi[0].informazioni+'</p>'+
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
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Descrizione:&nbsp;</strong>'+arrayEventi[0].descrizione+'</p>'+
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
                '<p class="size-26" style="Margin-top: 0;Margin-bottom: 0;font-size: 22px;line-height: 31px;" lang="x-size-26"><strong>Relatori:&nbsp;</strong>'+arrayEventi[0].relatori+'</p>'+
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
                '<a style="border-radius: 3px;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: green;font-family: Georgia, serif;" href="http://omceoce.ak12srl.it/partecipato">Partecipa</a>'+
            '&nbsp;'+
                '<a style="border-radius: 3px;display: inline-block;font-size: 14px;font-weight: bold;line-height: 24px;padding: 12px 24px;text-align: center;text-decoration: none !important;transition: opacity 0.1s ease-in;color: #ffffff !important;background-color: red;font-family: Georgia, serif;" href="http://omceoce.ak12srl.it/declinato">Declina</a>'+
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
                '<td class="emb-web-links" style="padding: 0;width: 26px;"><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #adb3b9;" href="https://www.facebook.com/medicicaserta/"><img style="border: 0;" src="https://i2.createsend1.com/static/eb/master/13-the-blueprint-3/images/facebook.png" width="26" height="26" alt="Facebook" /></a></td><td class="emb-web-links" style="padding: 0 0 0 3px;width: 26px;"><a style="text-decoration: underline;transition: opacity 0.1s ease-in;color: #adb3b9;" href="https://www.omceocaserta.it/"><img style="border: 0;" src="https://i7.createsend1.com/static/eb/master/13-the-blueprint-3/images/website.png" width="26" height="26" alt="Website" /></a></td>'+
            '</tr></tbody></table>'+
            '<div style="font-size: 12px;line-height: 19px;Margin-top: 20px;">'+
                '<div>OMCEO - CASERTA 2018</div>'+
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


            medicoId = arrayMedici[i]._id;
            eventoId = arrayEventi[0]._id;

            $.ajax({
                url: '/sendEmail',
                type: 'POST',
                data: JSON.stringify(datiEmail),
                cache: false,
                contentType: 'application/json',
                success: function (data) {

                    if(data===true){
                        var tipo = 'E-mail';
                        successMessage(medicoId,eventoId,tipo);
                    }


                },
                faliure: function (data) {

                }
            });

        }
        else if(arrayMedici[i].numero_telefono){

            console.log('SMS: '+arrayMedici[i].nome);

        }

    }

}