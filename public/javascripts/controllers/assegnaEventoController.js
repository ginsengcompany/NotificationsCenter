var arrayMedici =[];
var arrayEventi =[];

function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
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

$(document).ready(function() {

    var tabMedici = $('#tabellaMedici').DataTable( {
        ajax: "/getMedici",
        ajaxSettings: {
            method: "GET",
            cache: false
        },
        columns: [
            { "data": "_id", "visible": false },
            { "data": "matricola" },
            { "data": "cognome" },
            { "data": "nome" },
            { "data": "specializzazione" },
            { "data": "provincia" },
            { "data": "mail" }
        ]
    } );

    $('#tabellaMedici tbody').on( 'click', 'tr', function () {
        $(this).toggleClass('selected');
    } );

    var tabEventi = $('#tabellaEventi').DataTable( {
        ajax: "/getEventi",
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
            { "data": "data" , "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
            }},
            { "data": "luogo", "visible": false },
            { "data": "informazioni", "visible": false },
            { "data": "relatori", "visible": false },
            { "data": "descrizione", "visible": false },
            { "data": "_id" , "visible": false}
        ]
    } );

    $('#tabellaEventi tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
        }
        else {
            tabEventi.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
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

    $('#SalvaDati').click(function () {
        var ids = $.map(tabMedici.rows('.selected').data(), function (item) {
            return item['_id'];
        });
        arrayMedici.push(ids);
        //alert(tabEventi.rows('.selected').data().length + ' row(s) selected');
        var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
            return item['_id'];
        });
        arrayEventi.push(ids1);
        //alert(tabEventi.rows('.selected').data().length + ' row(s) selected');
    });

} );

function salvaDati(){

    console.log(arrayMedici);
    var idEvento=arrayEventi[0];

    /*var FCM = require('fcm-node');
    var serverKey = 'YOURSERVERKEYHERE'; //put your server key here
    var fcm = new FCM(serverKey);

    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
        to: 'registration_token',
        collapse_key: 'your_collapse_key',

        notification: {
            title: 'Title of your push notification',
            body: 'Body of your push notification'
        },

        data: {  //you can send only notification or only data(or include both)
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };

    fcm.send(message, function(err, response){
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });*/

    /*$.ajax({
        url: '/assegnaEvento',
        type: 'POST',
        data: JSON.stringify(''),
        cache: false,
        contentType: 'application/json',
        success: function(data) {
            alert('Assegnazione effettuata con Successo!');
        },
        faliure: function(data) {
            alert('Inserire tutti i CAMPI!');
        }
    });*/

}