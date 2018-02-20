var arrayUtenti = {};
var arrayEventi = {};

$(function() {
    moment.locale('it');
    $('#invioPush').prop('checked',true);
    $('#invioEmail').prop('checked',true);
    $('#invioSms').prop('checked',true);
});

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    var d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
        '<td>Data Fine:</td>'+
        '<td>'+convertDate(d.data_fine)+'</td>'+
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

var something = (function() {
    var executed = false;
    return function() {
        if (!executed) {
            executed = true;
            $('#tabellaUtenti tbody').on( 'click', 'tr', function () {
                $(this).toggleClass('selected');
            } );
        }
    };
})();

function getUtentiNotNotifica (){

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    datiNotNotifica = {
        "idEvento" : arrayEventi[0]._id
    };

    tabUtenti = $('#tabellaUtenti').DataTable( {
        responsive: true,
        ajax: {
            type: 'POST',
            url: '/getUtentiNotNotifica',
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

    something();

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
                function pad(s) { return (s < 10) ? '0' + s : s; }
                var d = new Date(data);
                return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
            }},
            { "data": "data_fine" , "render": function (data) {
                function pad(s) { return (s < 10) ? '0' + s : s; }
                var d = new Date(data);
                return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
            }, "visible": false},
            { "data": "informazioni", "visible": false },
            { "data": "relatori", "visible": false },
            { "data": "descrizione", "visible": false }

        ]
    } );

    $('#tabellaEventi tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('#tabellaUtenti').dataTable().fnClearTable();
        }
        else {
            tabEventi.rows().deselect();
            $(this).addClass('selected');
            $('#tabellaUtenti').dataTable().fnDestroy();
            getUtentiNotNotifica ();
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
    tabUtenti.rows().select();
}

function deselezionaTutti(){
    tabUtenti.rows().deselect();
}

function switchTable() {

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    datiNotNotifica = {
        "idEvento" : arrayEventi[0]._id
    };

    //token
    if($('#invioPush').prop('checked')===true && $('#invioEmail').prop('checked')===false && $('#invioSms').prop('checked')===false){
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiToken',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiTokenSms',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiTokenEmail',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiEmail',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiEmailSms',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiEmailToken',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiSms',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiSmsToken',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiSmsEmail',
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
        $('#tabellaUtenti').dataTable().fnDestroy();
        tabUtenti = $('#tabellaUtenti').DataTable( {
            responsive: true,
            ajax: {
                type: 'POST',
                url: '/getUtentiNotNotifica',
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
        $('#tabellaUtenti').dataTable().fnClearTable();
    }

};

var successMessage = function(idUtente,idEvento,tipo){

    var successMessageDati = {
        "idUtente" : idUtente,
        "idEvento" : idEvento,
        "stato": false,
        "confermato": false,
        "eliminato": false,
        "tipo": tipo
    };

    console.log(successMessageDati);

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

                tabUtenti.ajax.reload();
            }

        },
        faliure: function(data) {
            console.log('Errore!');
        }
    });

    $(document).ajaxStop(function() {
        $("#myModal1").modal('hide');
    });

};

function salvaDati(){

    var ids = $.map(tabUtenti.rows('.selected').data(), function (item) {
        return item;
    });
    arrayUtenti = ids;

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    for(var i=0; i<arrayUtenti.length; i++){

        var tipo = '';
        var idUtente = arrayUtenti[i]._id;
        var idEvento = arrayEventi[0]._id;

        if(arrayUtenti[i].token){

            tipo = 'Push Notifications';
            successMessage(idUtente,idEvento,tipo);

        }
        else if(arrayUtenti[i].mail){

            tipo = 'E-mail';
            successMessage(idUtente,idEvento,tipo);

        }
        else if(arrayUtenti[i].numero_telefono){

            tipo = 'SMS';
            successMessage(idUtente,idEvento,tipo);

        }

    }

}