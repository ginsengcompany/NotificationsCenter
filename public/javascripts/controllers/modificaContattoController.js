var arrayMedici = {};


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
    $('#modificaMedico').prop('disabled', true);
    $('#eliminaMedico').prop('disabled', true);

    tabMedici = $('#tabellaMedici').DataTable({
        ajax: "/getMedici",
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

    $('#tabellaMedici tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#modificaMedico').prop('disabled', true);
            $('#eliminaMedico').prop('disabled', true);
        }
        else {
            tabMedici.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#modificaMedico').prop('disabled', false);
            $('#eliminaMedico').prop('disabled', false);
        }
    });

    $('#tabellaMedici tbody').on('click', 'td.details-control', function () {
        var tr = $(this).closest('tr');
        var row = tabMedici.row(tr);

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

    var ids1 = $.map(tabMedici.rows('.selected').data(), function (item) {
        return item;
    });
    arrayMedici = ids1;

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

    $('#matricola').val(arrayMedici[0].matricola);
    $('#specializzazione').val(arrayMedici[0].specializzazione);
    $('#nome').val(arrayMedici[0].nome);
    $('#cognome').val(arrayMedici[0].cognome);
    $('#provincia').val(arrayMedici[0].provincia);
    $('#mail').val(arrayMedici[0].mail);
    $('#telefono').val(arrayMedici[0].numero_telefono);
    $('#pec').val(arrayMedici[0].pec);
}

datiMedico = {
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

function updateMedico(){

    datiMedico._id = arrayMedici[0]._id;
    datiMedico.matricola = $('#matricola').val();
    datiMedico.specializzazione = $('#specializzazione').val();
    datiMedico.nome = $('#nome').val();
    datiMedico.cognome = $('#cognome').val();
    datiMedico.provincia = $('#provincia').val();
    datiMedico.mail = $('#mail').val();
    datiMedico.telefono = $('#telefono').val();
    datiMedico.pec = $('#pec').val();


    $.ajax({
        url: '/getUpdateMedici',
        type: 'POST',
        data: JSON.stringify(datiMedico),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                $("#myModal1").modal('hide');
                $('#modificaMedico').prop('disabled', true);
                $('#eliminaMedico').prop('disabled', true);
                tabMedici.ajax.reload();

            }

        },
        faliure: function(data) {

        }
    });

}

function eliminaMedico(){

    var ids1 = $.map(tabMedici.rows('.selected').data(), function (item) {
        return item;
    });
    arrayMedici = ids1;

    $.ajax({
        url: '/getDeleteMedici',
        type: 'POST',
        data: JSON.stringify(arrayMedici),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                tabMedici.ajax.reload();
                $('#modificaMedico').prop('disabled', true);
                $('#eliminaMedico').prop('disabled', true);

            }

        },
        faliure: function(data) {

        }
    });

}
