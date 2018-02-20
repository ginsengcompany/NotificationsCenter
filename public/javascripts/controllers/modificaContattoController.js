var arrayUtenti = {};


function format ( d ) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
        '<td>E-Mail:</td>'+
        '<td>'+d.mail+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>Numero Telefono:</td>'+
        '<td>'+d.numero_telefono+'</td>'+
        '</tr>'+
        '<tr>'+
        '<td>PEC:</td>'+
        '<td>'+d.pec+'</td>'+
        '</tr>'+
        '</table>';
}

$(document).ready(function () {
    $('#modificaUtente').prop('disabled', true);
    $('#eliminaUtente').prop('disabled', true);

    tabUtenti = $('#tabellaUtenti').DataTable({
        ajax: "/getUtenti",
        responsive: true,
        ajaxSettings: {
            method: "GET",
            cache: false
        },
        columns: [
            {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": ''
            },
            {"data": "matricola"},
            {"data": "cognome"},
            {"data": "nome"},
            {"data": "specializzazione"},
            {"data": "provincia"},
            {"data": "mail", "visible": false},
            {"data": "numero_telefono", "visible": false},
            {"data": "pec", "visible": false}

        ]
    });

    $('#tabellaUtenti tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#modificaUtente').prop('disabled', true);
            $('#eliminaUtente').prop('disabled', true);
        }
        else {
            tabUtenti.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#modificaUtente').prop('disabled', false);
            $('#eliminaUtente').prop('disabled', false);
        }
    });

    $('#tabellaUtenti tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tabUtenti.row(tr);

        if (row.child.isShown()) {
            // This row is already open - close it
            row.child.hide();
            tr.removeClass('shown');
        }
        else {
            // Open this row
            row.child(format(row.data())).show();
            tr.addClass('shown');
        }
    });
});

function  openModal() {

    var ids1 = $.map(tabUtenti.rows('.selected').data(), function (item) {
        return item;
    });
    arrayUtenti = ids1;

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

    $('#matricola').val(arrayUtenti[0].matricola);
    $('#specializzazione').val(arrayUtenti[0].specializzazione);
    $('#nome').val(arrayUtenti[0].nome);
    $('#cognome').val(arrayUtenti[0].cognome);
    $('#provincia').val(arrayUtenti[0].provincia);
    $('#mail').val(arrayUtenti[0].mail);
    $('#telefono').val(arrayUtenti[0].numero_telefono);
    $('#pec').val(arrayUtenti[0].pec);
}

datiUtente = {
    "_id" : undefined,
    "matricola" : undefined,
    "specializzazione" : undefined,
    "nome" : undefined,
    "cognome" : undefined,
    "provincia" : undefined,
    "mail" : undefined,
    "telefono" : undefined,
    "pec" : undefined
}

function updateUtente(){

    datiUtente._id = arrayUtenti[0]._id;
    datiUtente.matricola = $('#matricola').val();
    datiUtente.specializzazione = $('#specializzazione').val();
    datiUtente.nome = $('#nome').val();
    datiUtente.cognome = $('#cognome').val();
    datiUtente.provincia = $('#provincia').val();
    datiUtente.mail = $('#mail').val();
    datiUtente.telefono = $('#telefono').val();
    datiUtente.pec = $('#pec').val();


    $.ajax({
        url: '/getUpdateUtenti',
        type: 'POST',
        data: JSON.stringify(datiUtente),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                $("#myModal1").modal('hide');
                $('#modificaUtente').prop('disabled', true);
                $('#eliminaUtente').prop('disabled', true);
                tabUtenti.ajax.reload();

            }

        },
        faliure: function(data) {

        }
    });

}

function eliminaUtente(){

    var ids1 = $.map(tabUtenti.rows('.selected').data(), function (item) {
        return item;
    });
    arrayUtenti = ids1;

    $.ajax({
        url: '/getDeleteUtenti',
        type: 'POST',
        data: JSON.stringify(arrayUtenti),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                tabUtenti.ajax.reload();
                $('#modificaUtente').prop('disabled', true);
                $('#eliminaUtente').prop('disabled', true);

            }

        },
        faliure: function(data) {

        }
    });

}
