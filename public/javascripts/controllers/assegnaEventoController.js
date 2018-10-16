let arrayUtenti = {};
let arrayEventi = {};
let eventi;
$('#conteinerHideData').hide();
$('#titoloSeleziona').hide();
$('#divButton').hide();

$(function() {
    moment.locale('it');
    $('#invioPush').prop('checked',false);
    $('#invioEmail').prop('checked',false);
    $('#invioSms').prop('checked',false);
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
        select: {
            style: 'multi'
        },
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
    });
    tabUtenti.on( 'select', function () {
        $('#divButton').show();
    });

    tabUtenti.on( 'deselect', function () {
        $('#divButton').hide();
    });
    something();
}


$(document).ready(function() {
    function format ( d ) {
        // `d` is the original data object for the row
        if (d.informazioni === null || d.informazioni === undefined){
            return '<table cellpadding="50" cellspacing="20" border="0" style="padding-left:50px;">' +
                '<tr>' +
                '<td style="font-weight: bold;">Descrizione: </td>' +
                '<td>' + d.descrizione + '</td>' +
                '</tr>' +
                '</table>';
        }else {
            return '<table cellpadding="50" cellspacing="20" border="0" style="padding-left:50px;">' +
                '<tr>' +
                '<td style="font-weight: bold;">Informazioni: </td>' +
                '<td>' + d.informazioni + '</td>' +
                '</tr>' +
                '<tr>' +
                '<td style="font-weight: bold;">Descrizione: </td>' +
                '<td>' + d.descrizione + '</td>' +
                '</tr>' +
                '</table>';
        }
    }

    setTimeout(function(){
        $('body').addClass('loaded');
        $('h1').css('color','#222222');
    }, 900);

    $('#hideInfo').hide();
    $('#conteinerHideEvento').hide();
    $('#conteinerHideModalita').hide();
    $('#conteinerHideData').hide();
    $('#titoloSeleziona').hide();
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
            select: {
                style: 'multi'
            },
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
    if ($('#invioEvento').is(":checked")) {
        $('#hideinfo').hide();
        $('#conteinerHideData').show();
    }
    else {
        $('#hideinfo').hide();
        $('#titoloSeleziona').hide();
        $('#conteinerHideData').hide();
    }
    $("#dataEvento").datepicker({
        defaultDate: "+1w",
        changeMonth: true,
        numberOfMonths: 2,
        dateFormat: 'dd/mm/yy',
        onSelect: function (dateText, inst) {
            if (dateText) {
                $('#titoloSeleziona').show();
                $.ajax({
                    type: "POST",
                    url: "/getEventiData",
                    data: dateText,
                    contentType: 'text/plain',
                    success: function (data, textStatus, jqXHR) {
                        if ($('#invioEvento').prop('checked') === true && $('#invioNotainformativa').prop('checked') === false) {
                            $('#hideInfo').hide();
                            $('#conteinerHideModalita').hide();
                            $('#tabellaEventi').dataTable().show();
                            $('#tabellaEventi').dataTable().fnDestroy();
                            $('#conteinerHideEvento').show();
                            tabEventi = $('#tabellaEventi').DataTable({
                                data: data,
                                responsive: true,
                                select: true,
                                order: [[4, "desc"]],
                                columns: [
                                    {
                                        "className": 'details-control',
                                        "orderable": false,
                                        "data": null,
                                        "defaultContent": ''
                                    },
                                    {"data": "titolo"},
                                    {"data": "sottotitolo"},
                                    {"data": "luogo"},
                                    {
                                        "data": "data", "render": function (data) {
                                            function pad(s) {
                                                return (s < 10) ? '0' + s : s;
                                            }

                                            let d = new Date(data);
                                            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                                        }
                                    },
                                    {
                                        "data": "data_fine", "render": function (data) {
                                            function pad(s) {
                                                return (s < 10) ? '0' + s : s;
                                            }

                                            let d = new Date(data);
                                            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                                        }
                                    },
                                    {"data": "relatori"},

                                ]
                            });
                            tabEventi.columns().every(function () {
                                var that = this;

                                $('input', this.footer()).on('keyup change', function () {
                                    if (that.search() !== this.value) {
                                        that
                                            .search(this.value)
                                            .draw();
                                    }
                                });
                            });
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                    }
                });
            }
        }
    });


    if ($('#invioEvento').prop('checked') === false && $('#invioNotainformativa').prop('checked') === true) {
        $('#hideInfo').hide();
        $('#conteinerHideModalita').hide();
        $('#tabellaEventi').dataTable().show();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#conteinerHideEvento').show();

        tabEventi = $('#tabellaEventi').DataTable({
            ajax: "/getNota",
            responsive: true,
            ajaxSettings: {
                method: "GET",
                cache: false
            },
            "order": [[4, "desc"]],
            columns: [
                {
                    "className": 'details-control',
                    "orderable": false,
                    "data": null,
                    "defaultContent": ''
                },
                {"data": "titolo"},
                {"data": "sottotitolo"},
                {"data": "luogo", "visible": false},
                {
                    "data": "data", "render": function (data) {
                        function pad(s) {
                            return (s < 10) ? '0' + s : s;
                        }

                        let d = new Date(data);
                        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                    }, "visible": false
                },
                {
                    "data": "data_fine", "render": function (data) {
                        function pad(s) {
                            return (s < 10) ? '0' + s : s;
                        }

                        let d = new Date(data);
                        return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
                    }, "visible": false
                },
                {"data": "relatori", "visible": false}

            ]
        });
    }

    if ($('#invioEvento').prop('checked') === false && $('#invioNotainformativa').prop('checked') === false) {
        $('#conteinerHideEvento').hide();
        $('#conteinerHideModalita').hide();
        $('#conteinerHideData').hide();
        $('#hideInfo').hide();
        $('#tabellaEventi').dataTable().hide();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#tabellaEventi').dataTable().fnClearTable();
    }

    if ($('#invioEvento').prop('checked') === true && $('#invioNotainformativa').prop('checked') === true) {

        $('#conteinerHideEvento').hide();
        $('#conteinerHideModalita').hide();
        $('#conteinerHideData').hide();
        $('#hideInfo').show();
        $('#tabellaEventi').dataTable().hide();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#tabellaEventi').dataTable().fnClearTable();

    }
}

/*function switchTable1() {


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
            order: [[ 4, "desc" ]],
            columns: [
                {
                    "className":      'details-control',
                    "orderable":      false,
                    "data":           null,
                    "defaultContent": ''
                },
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
                { "data": "relatori"},

            ]
        } );
        tabEventi.columns().every( function () {
            var that = this;

            $( 'input', this.footer() ).on( 'keyup change', function () {
                if ( that.search() !== this.value ) {
                    that
                        .search( this.value )
                        .draw();
                }
            } );
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
            "order": [[ 4, "desc" ]],
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
                    let  d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
                }, "visible": false },
                { "data": "data_fine" , "render": function (data) {
                    function pad(s) { return (s < 10) ? '0' + s : s; }
                    let  d = new Date(data);
                    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
                }, "visible": false },
                { "data": "relatori", "visible": false }

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

}*/

function salvaDati(){

    let ids = $.map(tabUtenti.rows('.selected').data(), function (item) {
        return item;
    });
    arrayUtenti = ids;
    let ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;
    if(!arrayUtenti.length || !arrayEventi.length || $('#invioPush').prop('checked')=== false || $('#invioEmail').prop('checked')=== false || $('#invioSms').prop('checked')=== false ){
        $('#myModal3').modal('show');
    }

    for(let i=0; i<arrayUtenti.length; i++){
        let idUtente = arrayUtenti[i]._id;
        let idEvento = arrayEventi[0]._id;
        let tipoEvento =  arrayEventi[0].tipo;

        if(arrayUtenti[i].token && $('#invioPush').prop('checked'))
            successMessage(idUtente,idEvento,'Push Notifications',tipoEvento);
        if(arrayUtenti[i].mail && $('#invioEmail').prop('checked'))
            successMessage(idUtente,idEvento,'E-mail',tipoEvento);
        if(arrayUtenti[i].numero_telefono &&  $('#invioSms').prop('checked'))
            successMessage(idUtente,idEvento,'SMS',tipoEvento);
    }
}