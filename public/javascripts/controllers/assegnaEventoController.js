var arrayMedici = {};
var arrayEventi = {};

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
    };

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
        "stato": false,
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
            else if(data.errore===false){
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

        var tipo = '';
        var idMedico = arrayMedici[i]._id;
        var idEvento = arrayEventi[0]._id;

        if(arrayMedici[i].token){

            tipo = 'Push Notifications';
            successMessage(idMedico,idEvento,tipo);

        }
        else if(arrayMedici[i].mail){

            tipo = 'E-mail';
            successMessage(idMedico,idEvento,tipo);

        }
        else if(arrayMedici[i].numero_telefono){

            tipo = 'SMS';
            successMessage(idMedico,idEvento,tipo);

        }

    }

}