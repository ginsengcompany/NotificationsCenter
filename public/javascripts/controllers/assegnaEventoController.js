let arrayUtenti = {};
let arrayEventi = {};

$(function() {
    moment.locale('it');
    $('#invioPush').prop('checked',true);
    $('#invioEmail').prop('checked',true);
    $('#invioSms').prop('checked',true);
    $('#tabellaUtenti').dataTable().fnClearTable();
});

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    let d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}

let something = (function() {
    let executed = false;
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

    let ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
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
            { "data": "username" },
            { "data": "cognome" },
            { "data": "nome" },
            { "data": "specializzazione" },
            { "data": "provincia" }
        ]
    } );

    something();

}

$(document).ready(function() {

    setTimeout(function(){
        $('body').addClass('loaded');
        $('h1').css('color','#222222');
    }, 900);

    $('#hideInfo').hide();
    $('#conteinerHideEvento').hide();
    $('#conteinerHideModalita').hide();
    $('#tabellaEventi').dataTable().hide();
    $('#tabellaEventi').dataTable().fnDestroy();
    $('#tabellaEventi').dataTable().fnClearTable();

    $('#tabellaEventi tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('#conteinerHideModalita').hide();
            $('#tabellaUtenti').dataTable().fnClearTable();
        }
        else {
            tabEventi.rows().deselect();
            $(this).addClass('selected');
            $('#conteinerHideModalita').show();
            $('#tabellaUtenti').dataTable().fnDestroy();
            getUtentiNotNotifica ();
        }
    } );

    $('#tabellaEventi tbody').on('click', 'td.details-control', function () {
        let tr = $(this).closest('tr');
        let row = tabEventi.row( tr );

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

    $.ajax({
        url: '/getInteressi',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            let arrayTokenField =[];

            for(let i =0;i<data.data.length;i++){


                let input = data.data[i].interesse + " - " + data.data[i].descrizione;

                arrayTokenField.push(input);

            }

            $('#interessi').tokenfield({
                autocomplete: {
                    source: arrayTokenField,
                    delay: 100
                },
                showAutocompleteOnFocus: true
            });

            $('#interessi').on('tokenfield:createtoken', function (event) {
                var existingTokens = $(this).tokenfield('getTokens');
                $.each(existingTokens, function(index, token) {
                    if (token.value === event.attrs.value)
                        event.preventDefault();
                });
            });



        },
        faliure: function(data) {

        }
    });

});

function  selezionaTutti() {
    tabUtenti.rows().select();
}

function deselezionaTutti(){
    tabUtenti.rows().deselect();
}

function switchTable() {

    let ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    datiNotNotifica = {
        "idEvento" : arrayEventi[0]._id,
        "interesse" : $('#interessi').tokenfield('getTokensList')
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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
                { "data": "username" },
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

let successMessage = function(idUtente,idEvento,tipo,tipoEvento){

    let successMessageDati = {
        "idUtente" : idUtente,
        "idEvento" : idEvento,
        "stato": false,
        "confermato": false,
        "eliminato": false,
        "tipo": tipo,
        "tipoEvento" : tipoEvento
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

};

$(document).ajaxStop(function() {
    $("#myModal1").modal('hide');
});

function switchTable1() {

    if($('#invioEvento').prop('checked')===true && $('#invioNotainformativa').prop('checked')===false){
        $('#hideInfo').hide();
        $('#conteinerHideModalita').hide();
        $('#tabellaEventi').dataTable().show();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#conteinerHideEvento').show();
        tabEventi = $('#tabellaEventi').DataTable( {
            ajax: "/getEventi",
            responsive: true,
            ajaxSettings: {
                method: "GET",
                cache: false
            },
            columns: [
                { "data": "titolo" },
                { "data": "sottotitolo" },
                { "data": "luogo"},
                { "data": "data" , "render": function (data) {
                    function pad(s) { return (s < 10) ? '0' + s : s; }
                    let  d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
                }},
                { "data": "data_fine" , "render": function (data) {
                    function pad(s) { return (s < 10) ? '0' + s : s; }
                    let  d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
                }},
                { "data": "informazioni"},
                { "data": "relatori"},
                { "data": "descrizione"}

            ]
        } );


    }

    if($('#invioEvento').prop('checked')===false && $('#invioNotainformativa').prop('checked')===true){
        $('#hideInfo').hide();
        $('#conteinerHideModalita').hide();
        $('#tabellaEventi').dataTable().show();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#conteinerHideEvento').show();

        tabEventi = $('#tabellaEventi').DataTable( {
            ajax: "/getNota",
            responsive: true,
            ajaxSettings: {
                method: "GET",
                cache: false
            },
            columns: [
                { "data": "titolo" },
                { "data": "sottotitolo" },
                { "data": "luogo", "visible": false },
                { "data": "data" , "render": function (data) {
                    function pad(s) { return (s < 10) ? '0' + s : s; }
                    let  d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
                }, "visible": false },
                { "data": "data_fine" , "render": function (data) {
                    function pad(s) { return (s < 10) ? '0' + s : s; }
                    let  d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
                }, "visible": false },
                { "data": "informazioni", "visible": false },
                { "data": "relatori", "visible": false },
                { "data": "descrizione"}

            ]
        } );



    }

    if($('#invioEvento').prop('checked')===false && $('#invioNotainformativa').prop('checked')===false){
        $('#conteinerHideEvento').hide();
        $('#conteinerHideModalita').hide();
        $('#hideInfo').hide();
        $('#tabellaEventi').dataTable().hide();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#tabellaEventi').dataTable().fnClearTable();
    }

    if($('#invioEvento').prop('checked')===true && $('#invioNotainformativa').prop('checked')===true){

        $('#conteinerHideEvento').hide();
        $('#conteinerHideModalita').hide();
        $('#hideInfo').show();
        $('#tabellaEventi').dataTable().hide();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#tabellaEventi').dataTable().fnClearTable();

    }

}

function salvaDati(){

    let ids = $.map(tabUtenti.rows('.selected').data(), function (item) {
        return item;
    });
    arrayUtenti = ids;

    let ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    for(let i=0; i<arrayUtenti.length; i++){

        let tipo = '';
        let idUtente = arrayUtenti[i]._id;
        let idEvento = arrayEventi[0]._id;
        let tipoEvento =  arrayEventi[0].tipo;

        if(arrayUtenti[i].token){

            tipo = 'Push Notifications';
            successMessage(idUtente,idEvento,tipo,tipoEvento);

        }
        else if(arrayUtenti[i].mail){

            tipo = 'E-mail';
            successMessage(idUtente,idEvento,tipo,tipoEvento);

        }
        else if(arrayUtenti[i].numero_telefono){

            tipo = 'SMS';
            successMessage(idUtente,idEvento,tipo,tipoEvento);

        }

    }

}