var arrayEventi = {};

function render (data) {
    var date = new Date(data);
    var month = date.getMonth() + 1;
    return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
}



function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
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

$(document).ready(function () {
    $('#modificaEvento').prop('disabled', true);
    $('#eliminaEvento').prop('disabled', true);

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
            { "data": "luogo"},
            { "data": "data" , "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
            }},
            { "data": "data_fine" , "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
            }},
            { "data": "informazioni", "visible": false },
            { "data": "relatori", "visible": false },
            { "data": "descrizione", "visible": false }

        ]
    } );

    $('#tabellaEventi tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('#modificaEvento').prop('disabled', true);
            $('#eliminaEvento').prop('disabled', true);
        }
        else {
            tabEventi.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#modificaEvento').prop('disabled', false);
            $('#eliminaEvento').prop('disabled', false);
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

function bs_input_file() {
    $(".input-file").before(
        function() {
            if ( ! $(this).prev().hasClass('input-ghost') ) {
                var element = $("<input type='file' class='input-ghost' onchange='encodeImageFileAsURL(this)' style='visibility:hidden; height:0'>");
                element.attr("name",$(this).attr("name"));
                element.change(function(){
                    element.next(element).find('input').val((element.val()).split('\\').pop());
                });
                $(this).find("button.btn-choose").click(function(){
                    element.click();
                });
                $(this).find("button.btn-reset").click(function(){
                    element.val(null);
                    $(this).parents(".input-file").find('input').val('');
                });
                $(this).find('input').css("cursor","pointer");
                $(this).find('input').mousedown(function() {
                    $(this).parents('.input-file').prev().click();
                    return false;
                });
                return element;
            }
        }
    );
}

$(function() {
    bs_input_file();
    $('#dataEvento').datepicker();
    $('#dataEventoFine').datepicker();
});

var datiEvento = {
    '_id' : undefined,
    'titolo' : undefined ,
    'sottotitolo' : undefined ,
    'data' : undefined ,
    'dataFine' : undefined ,
    'luogo' : undefined ,
    'informazioni' : undefined ,
    'relatori' : undefined ,
    'descrizione' : undefined ,
    'immagine' : undefined
};

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        datiEvento['immagine']= reader.result;
    };
    reader.readAsDataURL(file);
}

function  openModal() {

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayEventi = ids1;

    $("#myModal1").on("show", function () {
        $("#myModal1 a.btn").on("click", function (e) {
            console.log("button pressed");
            $("#myModal1").modal('hide');
        });
    });
    $("#myModal1").on("hide", function () {
        $("#myModal1 a.btn").off("click");
    });

    $("#myModal1").on("hidden", function () {
        $("#myModal1").remove();
    });

    $("#myModal1").modal({
        "backdrop": "static",
        "keyboard": true,
        "show": true
    });

    $('#titoloEvento').val(arrayEventi[0].titolo);
    $('#sottotitoloEvento').val(arrayEventi[0].sottotitolo);
    $('#dataEvento').val(render(arrayEventi[0].data));
    $('#dataEventoFine').val(render(arrayEventi[0].data_fine));
    $('#luogoEvento').val(arrayEventi[0].luogo);
    $('#informazioniEvento').val(arrayEventi[0].informazioni);
    $('#relatoriEvento').val(arrayEventi[0].relatori);
    $('#descrizioneEvento').val(arrayEventi[0].descrizione);
    $('#caricaFoto').val(arrayEventi[0].immagine);
}

function updateEvento(){

    datiEvento._id = arrayEventi[0]._id;
    datiEvento.titolo = $('#titoloEvento').val();
    datiEvento.sottotitolo = $('#sottotitoloEvento').val();
    datiEvento.data = $('#dataEvento').val();
    datiEvento.dataFine = $('#dataEventoFine').val();
    datiEvento.luogo = $('#luogoEvento').val();
    datiEvento.informazioni = $('#informazioniEvento').val();
    datiEvento.relatori = $('#relatoriEvento').val();
    datiEvento.descrizione = $('#descrizioneEvento').val();
    datiEvento.immagine = $('#caricaFoto').val();


    $.ajax({
        url: '/getUpdateEventi',
        type: 'POST',
        data: JSON.stringify(datiEvento),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                $("#myModal1").modal('hide');
                tabEventi.ajax.reload();
                $('#modificaEvento').prop('disabled', true);
                $('#eliminaEvento').prop('disabled', true);

            }else if(data.errore===true){

                $("#myModal1").modal('hide');
                alert('Data INIZIO / Data Fine non corretta usare il formato (GG/MM/AAAA)');

            }

        },
        faliure: function(data) {

        }
    });

}

function eliminaEvento(){

    var ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
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
