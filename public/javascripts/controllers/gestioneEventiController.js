let  arrayEventi = {};

function convertDate(inputFormat) {
    function pad(s) { return (s < 10) ? '0' + s : s; }
    let  d = new Date(inputFormat);
    return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
}


$(document).ready(function () {
    setTimeout(function(){
        $('body').addClass('loaded');
        $('h1').css('color','#222222');
    }, 900);

    $('#hideInfo').hide();
    $('#modificaEvento').prop('disabled', true);
    $('#eliminaEvento').prop('disabled', true);
    $('#modificaNota').prop('disabled', true);
    $('#eliminaNota').prop('disabled', true);
    $('#conteinerHideEvento').hide();
    $('#conteinerHideNota').hide();
    $('#tabellaEventi').dataTable().hide();
    $('#tabellaEventi').dataTable().fnDestroy();
    $('#tabellaEventi').dataTable().fnClearTable();
    $('#tabellaEventi tbody').on( 'click', 'tr', function () {
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');
            $('#modificaEvento').prop('disabled', true);
            $('#eliminaEvento').prop('disabled', true);
            $('#modificaNota').prop('disabled', true);
            $('#eliminaNota').prop('disabled', true);
        }
        else {
            tabEventi.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
            $('#modificaEvento').prop('disabled', false);
            $('#eliminaEvento').prop('disabled', false);
            $('#modificaNota').prop('disabled', false);
            $('#eliminaNota').prop('disabled', false);
        }
    } );

    $('#tabellaEventi tbody').on('click', 'td.details-control', function () {
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

function bs_input_file() {
    $(".input-file").before(
        function() {
            if ( ! $(this).prev().hasClass('input-ghost') ) {
                let  element = $("<input type='file' class='input-ghost' onchange='encodeImageFileAsURL(this)' style='visibility:hidden; height:0'>");
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
    $('#dataEvento').datepicker({ dateFormat: 'dd/mm/yy' }).css('z-index', 100000000);
    $('#dataEventoFine').datepicker({ dateFormat: 'dd/mm/yy' }).css('z-index', 100000000);
    $('#dataEvento2').datepicker({ dateFormat: 'dd/mm/yy' }).css('z-index', 100000000);
    $('#dataEventoFine2').datepicker({ dateFormat: 'dd/mm/yy' }).css('z-index', 100000000);
});

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
    'tipo' : undefined
};

function encodeImageFileAsURL(element) {
    let  file = element.files[0];
    let  reader = new FileReader();
    reader.onloadend = function() {
        datiEvento['immagine']= reader.result;
    };
    reader.readAsDataURL(file);
}

function  openModal() {

    let  ids1 = $.map(tabEventi.rows('.selected').data(), function (item) {
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
    $('#dataEvento').val(convertDate(arrayEventi[0].data));
    $('#dataEventoFine').val(convertDate(arrayEventi[0].data_fine));
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
    //datiEvento.immagine = $('#caricaFoto').val();
    console.log(datiEvento.immagine);


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

function openModal2(){
    $("#myModal2").on("show", function () {
        $("#myModal2 a.btn").on("click", function (e) {
            console.log("button pressed");
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

}

function addEvento(){
    datiEvento.titolo = $('#titoloEvento2').val();
    datiEvento.sottotitolo = $('#sottotitoloEvento2').val();
    datiEvento.data = $('#dataEvento2').val();
    datiEvento.dataFine = $('#dataEventoFine2').val();
    datiEvento.luogo = $('#luogoEvento2').val();
    datiEvento.informazioni = $('#informazioniEvento2').val();
    datiEvento.relatori = $('#relatoriEvento2').val();
    datiEvento.descrizione = $('#descrizioneEvento2').val();
    datiEvento.tipo = 1;

    if (
        (datiEvento.titolo === null || datiEvento.titolo === undefined || datiEvento.titolo === '') ||
        (datiEvento.sottotitolo === null || datiEvento.sottotitolo === undefined || datiEvento.sottotitolo === '') ||
        (datiEvento.data === null || datiEvento.data === undefined || datiEvento.data === '') ||
        (datiEvento.dataFine === null || datiEvento.dataFine === undefined || datiEvento.dataFine === '') ||
        (datiEvento.luogo === null || datiEvento.luogo === undefined || datiEvento.luogo === '') ||
        (datiEvento.informazioni === null || datiEvento.informazioni === undefined || datiEvento.informazioni === '') ||
        (datiEvento.relatori === null || datiEvento.relatori === undefined || datiEvento.relatori === '') ||
        (datiEvento.descrizione === null || datiEvento.descrizione === undefined || datiEvento.descrizione === '')
    ) {
        $("#myModal3").on("show", function () {
            $("#myModal3 a.btn").on("click", function (e) {
                console.log("button pressed");
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
            url: '/salvaEvento',
            type: 'POST',
            data: JSON.stringify(datiEvento),
            cache: false,
            contentType: 'application/json',
            success: function (data) {

                $("#myModal2").modal('hide');
                $('#modificaEvento').prop('disabled', true);
                $('#eliminaEvento').prop('disabled', true);
                tabEventi.ajax.reload();

                $('#titoloEvento2').val('');
                $('#sottotitoloEvento2').val('');
                $('#luogoEvento2').val('');
                $('#informazioniEvento2').val('');
                $('#relatoriEvento2').val('');
                $('#descrizioneEvento2').val('');
                $('#dataEvento2').val('');
                $('#dataEventoFine2').val('');
                $('#caricaFoto2').val('');

            },
            faliure: function (data) {
                $("#myModal3").on("show", function () {
                    $("#myModal3 a.btn").on("click", function (e) {
                        console.log("button pressed");
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

function addNota(){
    datiEvento.titolo = $('#titoloEvento4').val();
    datiEvento.sottotitolo = $('#sottotitoloEvento4').val();
    datiEvento.descrizione = $('#descrizioneEvento4').val();
    datiEvento.tipo = 2;

    if (
        (datiEvento.titolo === null || datiEvento.titolo === undefined || datiEvento.titolo === '') ||
        (datiEvento.sottotitolo === null || datiEvento.sottotitolo === undefined || datiEvento.sottotitolo === '') ||
        (datiEvento.descrizione === null || datiEvento.descrizione === undefined || datiEvento.descrizione === '')
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

function switchTable() {

    if($('#invioEvento').prop('checked')===true && $('#invioNotainformativa').prop('checked')===false){
        $('#conteinerHideNota').hide();
        $('#hideInfo').hide();
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
            columns: [
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
                { "data": "informazioni" },
                { "data": "relatori"},
                { "data": "descrizione"}

            ]
        } );


    }

    if($('#invioEvento').prop('checked')===false && $('#invioNotainformativa').prop('checked')===true){
        $('#hideInfo').hide();
        $('#tabellaEventi').dataTable().show();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#conteinerHideEvento').hide();
        $('#conteinerHideNota').show();

        tabEventi = $('#tabellaEventi').DataTable( {
            ajax: "/getNota",
            responsive: true,
            ajaxSettings: {
                method: "GET",
                cache: false
            },
            columns: [
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
                { "data": "informazioni", "visible": false },
                { "data": "relatori", "visible": false },
                { "data": "descrizione"}

            ]
        } );



    }

    if($('#invioEvento').prop('checked')===false && $('#invioNotainformativa').prop('checked')===false){
        $('#conteinerHideEvento').hide();
        $('#conteinerHideNota').hide();
        $('#hideInfo').hide();
        $('#tabellaEventi').dataTable().hide();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#tabellaEventi').dataTable().fnClearTable();
    }

    if($('#invioEvento').prop('checked')===true && $('#invioNotainformativa').prop('checked')===true){

        $('#conteinerHideNota').hide();
        $('#conteinerHideEvento').hide();
        $('#hideInfo').show();
        $('#tabellaEventi').dataTable().hide();
        $('#tabellaEventi').dataTable().fnDestroy();
        $('#tabellaEventi').dataTable().fnClearTable();

    }

}