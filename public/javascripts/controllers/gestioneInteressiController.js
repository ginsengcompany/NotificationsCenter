let arrayInteressi = {};

$(document).ready(function () {
    setTimeout(function(){
        $('body').addClass('loaded');
        $('h1').css('color','#222222');
    }, 900);
    $('#modificaInteresse').prop('disabled', true);
    $('#eliminaInteresse').prop('disabled', true);

    tabInteressi = $('#tabellaInteressi').DataTable({
        ajax: "/getInteressi",
        responsive: true,
        ajaxSettings: {
            method: "GET",
            cache: false
        },
        columns: [
            {"data": "_id", "visible": false},
            {"data": "interesse"},
            {"data": "descrizione"}
        ]
    });

    $('#tabellaInteressi tbody').on('click', 'tr', function () {
        if ($(this).hasClass('selected')) {
            $(this).removeClass('selected');
            $('#modificaInteresse').prop('disabled', true);
            $('#eliminaInteresse').prop('disabled', true);
        }
        else {
            tabInteressi.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#modificaInteresse').prop('disabled', false);
            $('#eliminaInteresse').prop('disabled', false);
        }
    });

    $('#tabellaInteressi tbody').on('click', 'td.details-control', function () {
        let tr = $(this).closest('tr');
        let row = tabInteressi.row(tr);

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

function  openModalUpdate() {

    let ids1 = $.map(tabInteressi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayInteressi = ids1;

    $("#modalModificaInteressi").on("show", function () {
        $("#modalModificaInteressi a.btn").on("click", function (e) {
            console.log("button pressed");
            $("#modalModificaInteressi").modal('hide');
        });
    });
    $("#modalModificaInteressi").on("hide", function () {
        $("#modalModificaInteressi a.btn").off("click");
    });

    $("#modalModificaInteressi").on("hidden", function () {
        $("#modalModificaInteressi").remove();
    });

    $("#modalModificaInteressi").modal({
        "backdrop": "static",
        "keyboard": true,
        "show": true
    });

    $('#interesse').val(arrayInteressi[0].interesse);
    $('#descrizione').val(arrayInteressi[0].descrizione);
}

function  openModalAdd() {

    $("#modalAggiungiInteressi").on("show", function () {
        $("#modalAggiungiInteressi a.btn").on("click", function (e) {
            console.log("button pressed");
            $("#modalAggiungiInteressi").modal('hide');
        });
    });
    $("#modalAggiungiInteressi").on("hide", function () {
        $("#modalAggiungiInteressi a.btn").off("click");
    });

    $("#modalAggiungiInteressi").on("hidden", function () {
        $("#modalAggiungiInteressi").remove();
    });

    $("#modalAggiungiInteressi").modal({
        "backdrop": "static",
        "keyboard": true,
        "show": true
    });

}

datiInteressi = {
    "_id" : undefined,
    "interesse" : undefined,
    "descrizione" : undefined
};

function updateInteresse(){

    datiInteressi._id = arrayInteressi[0]._id;
    datiInteressi.interesse = $('#interesse').val();
    datiInteressi.descrizione = $('#descrizione').val();

    $.ajax({
        url: '/getUpdateInteressi',
        type: 'POST',
        data: JSON.stringify(datiInteressi),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                $("#modalModificaInteressi").modal('hide');
                $('#modificaInteresse').prop('disabled', true);
                $('#eliminaInteresse').prop('disabled', true);
                tabInteressi.ajax.reload();

            }

        },
        faliure: function(data) {

        }
    });
}

function eliminaInteresse(){

    let ids1 = $.map(tabInteressi.rows('.selected').data(), function (item) {
        return item;
    });
    arrayInteressi = ids1;

    $.ajax({
        url: '/getDeleteInteressi',
        type: 'POST',
        data: JSON.stringify(arrayInteressi),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            if(data.errore===false){

                tabInteressi.ajax.reload();
                $('#modificaInteresse').prop('disabled', true);
                $('#eliminaInteresse').prop('disabled', true);
            }
        },
        faliure: function(data) {

        }
    });

}

function addInteresse(){

    datiInteressi.interesse = $('#interesse2').val();
    datiInteressi.descrizione = $('#descrizione2').val();

    $.ajax({
        url: '/getAddInteressi',
        type: 'POST',
        data: JSON.stringify(datiInteressi),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            $('#modalAggiungiInteressi').modal('hide');
            $('#modificaInteresse').prop('disabled', true);
            $('#eliminaInteresse').prop('disabled', true);
            tabInteressi.ajax.reload();


        },
        faliure: function(data) {

        }
    });

}