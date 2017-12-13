var arrayMedici = {};
var arrayEventi = {};

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

     tabMedici = $('#tabellaMedici').DataTable( {
        ajax: "/getMedici",
        responsive: true,
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

});


var successMessage = function(idMedico,idEvento){

    var successMessageDati = {
        "idMedico" : idMedico,
        "idEvento" : idEvento,
        "stato": true,
        "confermato": false,
        "eliminato": false
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
            successMessage(idMedico,idEvento);
            console.log(data);
        },
        faliure: function(data) {
            console.error('Error:', data.errors);
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
        sendMessage(arrayMedici[i].token, 'Hai un nuovo Evento entra subito nell`app per scoprire!',arrayMedici[i]._id,arrayEventi[i]._id);
    }

}