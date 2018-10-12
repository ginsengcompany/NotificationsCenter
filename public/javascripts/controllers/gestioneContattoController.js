let arrayUtenti = {};
let arrayInteressi = [];

/*for(let i =0;i<data.data.length;i++){
    arrayInteressi[i].id = data.data[i]._id;
    arrayInteressi[i].descrizione = data.data[i].descrizione;
    arrayInteressi[i].interesse = data.data[i].interesse;
    let input = data.data[i].interesse + " - " + data.data[i].descrizione;
    $('#selectInt').append('<option value="' + data.data[i]._id + '">' + data.data[i].descrizione + ' ' + data.data[i].interesse + '</option>')
}*/

$(document).ready(function () {
    $('.mdb-select').material_select();

    $.ajax({
        url: '/getInteressi',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        success: function(data) {
            arrayInteressi = [];
            for(let i =0;i<data.data.length;i++){
                var interesse = {
                    id : '',
                    descrizione : '',
                    interesse: ''
                };
                interesse.id = data.data[i]._id;
                interesse.descrizione = data.data[i].descrizione;
                interesse.interesse = data.data[i].interesse;
                arrayInteressi.push(interesse);
            }
            console.log(arrayInteressi);
        },
        faliure: function(data) {

        }
    });

    /*$.ajax({
        url: '/getInteressi',
        type: 'GET',
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            let arrayTokenField =[];

            for(let i =0;i<data.data.length;i++){

                let input = data.data[i].interesse + " - " + data.data[i].descrizione;
                console.log(input + ' ecco');

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

            $('#interessi2').tokenfield({
                autocomplete: {
                    source: arrayTokenField,
                    delay: 100
                },
                showAutocompleteOnFocus: true
            });

            $('#interessi2').on('tokenfield:createtoken', function (event) {
                var existingTokens = $(this).tokenfield('getTokens');
                $.each(existingTokens, function(index, token) {
                    if (token.value === event.attrs.value)
                        event.preventDefault();
                });
            });
        },
        faliure: function(data) {

        }
    });*/

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
            {"data": "username"},
            {"data": "password"},
            {"data": "cognome"},
            {"data": "nome"},
            {"data": "specializzazione"},
            {"data": "provincia"},
            {"data": "mail"},
            {"data": "numero_telefono"},
            {"data": "pec"},
            //{"data": "interessi"}
            // Visualizzo il JSON Obj in forma di stringa ma dalla GET resta un JSON Obj
            {
                "data": "interessi", "render": function (data) {
                let stringaInteressi = "";
                for(let i =0;i<data.length;i++) {
                    stringaInteressi = stringaInteressi + data[i].descrizione + "-" + data[i].interesse + ",";
                }
                stringaInteressi = stringaInteressi.substring(0, stringaInteressi.length-1);
                return stringaInteressi;
                }
            }
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
        let tr = $(this).closest('tr');
        let row = tabUtenti.row(tr);

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

function  openModal2() {

    $("#myModal2").on("show", function () {
        $("#myModal2 a.btn").on("click", function (e) {
            $("#myModal2").modal('hide');
        });
    });

    $("#myModal2").on("hide", function () {
        $("#myModal2 a.btn").off("click");
    });

    $("#myModal2").on("hidden", function () {
        $("#myModal2").remove();
    });

    $("#myModal2").modal({
        "backdrop": "static",
        "keyboard": true,
        "show": true
    });
}

function resetSelect()
{
    $('#selectInt')
        .empty()
        .append('<option selected="", value="0", disabled="">Seleziona gli interessi</option>');
    $('#selectInt').material_select('destroy');
    $('#selectInt').val();
    $('#selectInt').material_select();
}

function  openModal() {

    let ids1 = $.map(tabUtenti.rows('.selected').data(), function (item) {
        return item;
    });

    arrayUtenti = ids1;

    $("#myModal1").on("show", function () {
        $("#myModal1 a.btn").on("click", function (e) {
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

    $('#username').val(arrayUtenti[0].username);
    $('#password').val(arrayUtenti[0].password);
    $('#specializzazione').val(arrayUtenti[0].specializzazione);
    $('#nome').val(arrayUtenti[0].nome);
    $('#cognome').val(arrayUtenti[0].cognome);
    $('#provincia').val(arrayUtenti[0].provincia);
    $('#mail').val(arrayUtenti[0].mail);
    $('#telefono').val(arrayUtenti[0].numero_telefono);
    $('#pec').val(arrayUtenti[0].pec);

    resetSelect();
    for(let i = 0; i < arrayInteressi.length; i++){
        $('#selectInt').append(
            '<option value="' + arrayInteressi[i].id + '">'
            + arrayInteressi[i].descrizione + '-' + arrayInteressi[i].interesse
            + '</option>'
        );
    }

    //$('#interessi').val(arrayUtenti[0].interessi);
    if (arrayUtenti[0].attivo === true || arrayUtenti[0].attivo === 'true')
        $("#utenteAttivo").prop("checked", true);
    else
        $("#utenteAttivo").prop("checked", false);
}

datiUtente = {
    "_id" : undefined,
    "username" : undefined,
    "password" : undefined,
    "specializzazione" : undefined,
    "nome" : undefined,
    "cognome" : undefined,
    "provincia" : undefined,
    "mail" : undefined,
    "telefono" : undefined,
    "pec" : undefined,
    "interessi" : undefined,
    "attivo" : undefined
}

function updateUtente(){

    datiUtente._id = arrayUtenti[0]._id;
    datiUtente.username = $('#username').val();
    datiUtente.password = $('#password').val();
    datiUtente.specializzazione = $('#specializzazione').val();
    datiUtente.nome = $('#nome').val();
    datiUtente.cognome = $('#cognome').val();
    datiUtente.provincia = $('#provincia').val();
    datiUtente.mail = $('#mail').val();
    datiUtente.telefono = $('#telefono').val();
    datiUtente.pec = $('#pec').val();
    datiUtente.interessi = $('#interessi').tokenfield('getTokensList');
    datiUtente.attivo = $("#utenteAttivo").is(":checked") ? true : false;

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

    let ids1 = $.map(tabUtenti.rows('.selected').data(), function (item) {
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

let datiContatto = {
    'nome' : undefined,
    'cognome' : undefined,
    'specializzazione' : undefined,
    'provincia' : undefined,
    'mail' : undefined,
    'username' : undefined,
    'password' : undefined,
    'numero_telefono' : undefined,
    'pec' : undefined,
    'interesse' : undefined
};

function AddUtente(){

    datiContatto.nome = $('#nome2').val();
    datiContatto.cognome = $('#cognome2').val();
    datiContatto.specializzazione = $('#specializzazione2').val();
    datiContatto.provincia = $('#provincia2').val();
    datiContatto.mail = $('#mail2').val();
    datiContatto.username = $('#username2').val();
    datiContatto.password = $('#password2').val();
    datiContatto.numero_telefono = $('#telefono2').val();
    datiContatto.pec = $('#pec2').val();
    datiContatto.interesse = $('#interessi2').val();
    datiContatto.attivo = $("#utenteAttivo").is(":checked") ? "TRUE" : "FALSE";

    if (
        (datiContatto.nome === null || datiContatto.nome === undefined || datiContatto.nome === '' || datiContatto.nome === "") ||
        (datiContatto.cognome === null || datiContatto.cognome === undefined || datiContatto.cognome === '' || datiContatto.cognome === "") ||
        (datiContatto.specializzazione === null || datiContatto.specializzazione === undefined || datiContatto.specializzazione === '' || datiContatto.specializzazione === "") ||
        (datiContatto.provincia === null || datiContatto.provincia === undefined || datiContatto.provincia === '' || datiContatto.provincia === "") ||
        (datiContatto.username === null || datiContatto.username === undefined || datiContatto.username === '' || datiContatto.username === "") ||
        (datiContatto.password === null || datiContatto.password === undefined || datiContatto.password === '' || datiContatto.password === "")
    ) {
        $("#myModal3").on("show", function () {
            $("#myModal3 a.btn").on("click", function (e) {
                $("#myModal3").modal('hide');
            });
        });
        $("#myModal3").on("hide", function () {
            $("#myModal3 a.btn").off("click");
        });

        $("#myModal3").on("hidden", function () {
            $("#myModal3").remove();
        });

        $("#myModal3").modal({
            "backdrop": "static",
            "keyboard": true,
            "show": true
        });
    }
    else {
        $.ajax({
            url: '/salvaContatto',
            type: 'POST',
            data: JSON.stringify(datiContatto),
            cache: false,
            contentType: 'application/json',
            success: function (data) {

                if(data !==false){
                    $("#myModal2").modal('hide');
                    $('#modificaUtente').prop('disabled', true);
                    $('#eliminaUtente').prop('disabled', true);
                    tabUtenti.ajax.reload();

                    $('#nome2').val('');
                    $('#cognome2').val('');
                    $('#specializzazione2').val('');
                    $('#provincia2').val('');
                    $('#mail2').val('');
                    $('#username2').val('');
                    $('#password2').val('');
                    $('#telefono2').val('');
                    $('#pec2').val('');
                    $('#interessi2').val('');
                    $('#utenteAttivo2').val('');

                }


                if(data ===false){

                    $("#myModal5").on("show", function () {
                        $("#myModal5 a.btn").on("click", function (e) {
                            $("#myModal5").modal('hide');
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

                }

            },
            faliure: function (data) {
                $("#myModal3").on("show", function () {
                    $("#myModal3 a.btn").on("click", function (e) {
                        $("#myModal3").modal('hide');
                    });
                });
                $("#myModal3").on("hide", function () {
                    $("#myModal3 a.btn").off("click");
                });

                $("#myModal3").on("hidden", function () {
                    $("#myModal3").remove();
                });

                $("#myModal3").modal({
                    "backdrop": "static",
                    "keyboard": true,
                    "show": true
                });
            }
        });
    }
}