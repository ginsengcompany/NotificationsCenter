var arrayMedici = {};
var arrayEventi = {};

$('#email').val('omceoce.ak12srl@gmail.com');
$('#password').val('omceoce.ak12');


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

$(document).ready(function() {

    tabMedici = $('#tabellaMedici').DataTable( {
        ajax: "/getMediciEmail",
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

function  selezionaTutti() {
    tabMedici.rows().select();
}

function deselezionaTutti(){
    tabMedici.rows().deselect();
}


datiEmail = {

    "user":undefined,
    "pass":undefined,
    "from":undefined,
    "to":undefined,
    "subject":undefined,
    "text": undefined,
    "service":undefined

};

function successEmail(idMedico,idEvento) {

    var successEmailDati = {
        "idMedico" : idMedico,
        "idEvento" : idEvento,
        "stato": true
    };

    $.ajax({
        url: '/salvaStatoEmail',
        type: 'POST',
        data: JSON.stringify(successEmailDati),
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

}


function salvaDati(){

    var ids = $.map(tabMedici.rows('.selected').data(), function (item) {
        return item;
    });
    arrayMedici = ids;

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    console.log(arrayMedici);

    for(var i=0; i<arrayMedici.length; i++){

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
                    successEmail(medicoId,eventoId);
                }


            },
            faliure: function (data) {

            }
        });
    }

}