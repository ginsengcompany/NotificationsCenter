let  arrayEventi = {};

let  datiEvento = {
    '_id' : undefined,
    'titolo' : undefined ,
    'sottotitolo' : undefined ,
    'data' : undefined ,
    'dataFine' : undefined ,
    'luogo' : undefined ,
    'informazioni' : undefined ,
    'relatori' : undefined ,
    'descrizione' : undefined ,
    'immagine' : undefined,
    'tipo' : undefined,
    'url_evento': undefined
};

$(document).ready(function () {

    tabEventi = $('#tabellaNote').DataTable( {
        ajax: "/getNota",
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

    $('#modificaNota').prop('disabled', true);
    $('#eliminaNota').prop('disabled', true);
    $('#tabellaNote tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('#modificaNota').prop('disabled', true);
            $('#eliminaNota').prop('disabled', true);
        }
        else {
            tabEventi.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#modificaNota').prop('disabled', false);
            $('#eliminaNota').prop('disabled', false);
        }
    } );
    function format ( d ) {
        // `d` is the original data object for the row
        if (d.informazioni === null || d.informazioni === undefined){
            return '<table cellpadding="50" cellspacing="20" border="0" style="padding-left:50px;">' +
                '<tr>' +
                '<td style="font-weight: bold;">Url Evento: </td>' +
                '<td>' + d.url_evento +'</td>' +
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

    $('#tabellaNote tbody').on('click', 'td.details-control', function () {
        let  tr = $(this).closest('tr');
        let  row = tabEventi.row( tr );

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

function openModal4(){
    $("#myModal4").on("show", function () {
        $("#myModal4 a.btn").on("click", function (e) {
            console.log("button pressed");
            $("#myModal4").modal('hide');
        });
    });
    $("#myModal4").on("hide", function () {
        $("#myModal4 a.btn").off("click");
    });

    $("#myModal4").on("hidden", function () {
        $("#myModal4").remove();
    });

    $("#myModal4").modal({
        "backdrop": "static",
        "keyboard": true,
        "show": true
    });
}

function openModal5(){

    let  ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    $("#myModal5").on("show", function () {
        $("#myModal1 a.btn").on("click", function (e) {
            console.log("button pressed");
            $("#myModal1").modal('hide');
        });
    });
    $("#myModal5").on("hide", function () {
        $("#myModal5 a.btn").off("click");
    });

    $("#myModal5").on("hidden", function () {
        $("#myModal5").remove();
    });

    $("#myModal5").modal({
        "backdrop": "static",
        "keyboard": true,
        "show": true
    });

    $('#titoloEvento5').val(arrayEventi[0].titolo);
    $('#sottotitoloEvento5').val(arrayEventi[0].sottotitolo);
    $('#descrizioneEvento5').val(arrayEventi[0].descrizione);
    $('#urlEvento5').val(arrayEventi[0].url_evento);

}

function addNota(){
    datiEvento.titolo = $('#titoloEvento4').val();
    datiEvento.sottotitolo = $('#sottotitoloEvento4').val();
    datiEvento.descrizione = $('#descrizioneEvento4').val();
    datiEvento.url_evento = $('#urlEvento4').val();
    datiEvento.tipo = 2;

    if (
        (datiEvento.titolo === null || datiEvento.titolo === undefined || datiEvento.titolo === '') ||
        (datiEvento.sottotitolo === null || datiEvento.sottotitolo === undefined || datiEvento.sottotitolo === '') ||
        (datiEvento.descrizione === null || datiEvento.descrizione === undefined || datiEvento.descrizione === '') ||
        (datiEvento.url_evento === null || datiEvento.url_evento === undefined || datiEvento.url_evento === '')
    ) {
        $("#myModal6").on("show", function () {
            $("#myModal6 a.btn").on("click", function (e) {
                console.log("button pressed");
                $("#myModal6").modal('hide');
            });
        });
        $("#myModal6").on("hide", function () {
            $("#myModal6 a.btn").off("click");
        });

        $("#myModal6").on("hidden", function () {
            $("#myModal6").remove();
        });

        $("#myModal6").modal({
            "backdrop": "static",
            "keyboard": true,
            "show": true
        });
    }
    else {
        $.ajax({
            url: '/salvaNota',
            type: 'POST',
            data: JSON.stringify(datiEvento),
            cache: false,
            contentType: 'application/json',
            success: function (data) {

                $("#myModal4").modal('hide');
                $('#modificaNota').prop('disabled', true);
                $('#eliminaNota').prop('disabled', true);
                tabEventi.ajax.reload();

                $('#titoloEvento4').val('');
                $('#sottotitoloEvento4').val('');
                $('#descrizioneEvento4').val('');
                $('#urlEvento4').val('');


            },
            faliure: function (data) {
                $("#myModal6").on("show", function () {
                    $("#myModal6 a.btn").on("click", function (e) {
                        console.log("button pressed");
                        $("#myModal6").modal('hide');
                    });
                });
                $("#myModal6").on("hide", function () {
                    $("#myModal6 a.btn").off("click");
                });

                $("#myModal6").on("hidden", function () {
                    $("#myModal6").remove();
                });

                $("#myModal6").modal({
                    "backdrop": "static",
                    "keyboard": true,
                    "show": true
                });
            }
        });
    }
}

function updateNota(){

    datiEvento._id = arrayEventi[0]._id;
    datiEvento.titolo = $('#titoloEvento5').val();
    datiEvento.sottotitolo = $('#sottotitoloEvento5').val();
    datiEvento.descrizione = $('#descrizioneEvento5').val();
    datiEvento.url_evento = $('#urlEvento5').val();

    $.ajax({
        url: '/getUpdateNota',
        type: 'POST',
        data: JSON.stringify(datiEvento),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                $("#myModal5").modal('hide');
                tabEventi.ajax.reload();
                $('#modificaNota').prop('disabled', true);
                $('#eliminaNota').prop('disabled', true);

            }
        },
        faliure: function(data) {

        }
    });

}

function eliminaEvento(){

    let  ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    $.ajax({
        url: '/getDeleteEventi',
        type: 'POST',
        data: JSON.stringify(arrayEventi),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                tabEventi.ajax.reload();
                $('#modificaEvento').prop('disabled', true);
                $('#eliminaEvento').prop('disabled', true);

            }

        },
        faliure: function(data) {

        }
    });

}
