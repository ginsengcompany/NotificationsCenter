$(function() {
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
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
});

var datiEvento = {
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

function salvaDati() {

    datiEvento.titolo = $('#titoloEvento').val();
    datiEvento.sottotitolo = $('#sottotitoloEvento').val();
    datiEvento.data = $('#datetimepicker1').data();
    datiEvento.dataFine = $('#datetimepicker2').data();
    datiEvento.luogo = $('#luogoEvento').val();
    datiEvento.informazioni = $('#informazioniEvento').val();
    datiEvento.relatori = $('#relatoriEvento').val();
    datiEvento.descrizione = $('#descrizioneEvento').val();

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
    }
    else {
        $.ajax({
            url: '/salvaEvento',
            type: 'POST',
            data: JSON.stringify(datiEvento),
            cache: false,
            contentType: 'application/json',
            success: function (data) {
                $("#myModal").on("show", function () {
                    $("#myModal a.btn").on("click", function (e) {
                        console.log("button pressed");
                        $("#myModal").modal('hide');
                    });
                });
                $("#myModal").on("hide", function () {
                    $("#myModal a.btn").off("click");
                });

                $("#myModal").on("hidden", function () {
                    $("#myModal").remove();
                });

                $("#myModal").modal({
                    "backdrop": "static",
                    "keyboard": true,
                    "show": true
                });

                $('#titoloEvento').val('');
                $('#sottotitoloEvento').val('');
                $('#luogoEvento').val('');
                $('#informazioniEvento').val('');
                $('#relatoriEvento').val('');
                $('#descrizioneEvento').val('');
            },
            faliure: function (data) {
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
            }
        });
    }
}

var editor; // use a global for the submit and return data rendering in the examples

(function() {
    var Editor = $.fn.dataTable.Editor;
    Editor.display.details = $.extend(true, {}, Editor.models.displayController, {
        init: function(editor) {
            // Setup the lightbox - we'll use it for new entries
            Editor.display.lightbox.init(editor);

            // No other setup needed
            return Editor.display.details;
        },

        open: function(editor, append, callback) {
            var table = $(editor.s.table).DataTable();
            var row = editor.s.modifier;

            // Close any rows which are already open
            Editor.display.details.close(editor);

            if (editor.mode() === 'create') {
                // Its a new row. Use Editor's lightbox
                Editor.display.lightbox.open(editor, append, callback);
            } else {
                // Open the child row on the DataTable
                table.row(row).child(append).show();

                $(table.row(row).node()).addClass('shown');

                if (callback) {
                    callback();
                }
            }
        },

        close: function(editor, callback) {
            Editor.display.lightbox.close(editor, callback);

            var table = $(editor.s.table).DataTable();

            table.rows().every(function() {
                if (this.child.isShown()) {
                    this.child.hide();
                    $(this.node()).removeClass('shown');
                }
            });

            if (callback) {
                callback();
            }
        }
    });
})();

$(document).ready(function() {
    editor = new $.fn.dataTable.Editor( {
        ajax: "/getUpdateEventi",
        responsive: true,
        ajaxSettings: {
            method: "POST",
            cache: false
        },
        table: "#tabellaEventi",
        display: "details",
        idSrc:  '_id',
        fields: [{
                  label: "Serie:",
                  name: "_id"
            },
            {
            label: "Titolo:",
            name: "titolo"
        }, {
            label: "Sottotitolo:",
            name: "sottotitolo"
        }, {
            label: "Luogo:",
            name: "luogo"
        }, {
            label: "Data Inizio:",
            name: "data",
            type: "datetime"
        }, {
            label: "Data Fine:",
            name: "data_fine",
            type: "datetime"
        }, {
            label: "Informazioni:",
            name: "informazioni"
        }, {
            label: "Relatori:",
            name: "relatori"
        }, {
            label: "Descrizione:",
            name: "descrizione"
        }
        ]
    } );

    editor.field( '_id' ).disable();

    var table = $('#tabellaEventi').DataTable( {
        ajax: "/getEventi",
        responsive: true,
        ajaxSettings: {
            method: "GET",
            cache: false
        },
        columns: [
            {
                className:      'details-control',
                orderable:      false,
                data:           null,
                defaultContent: ''
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
            { "data": "informazioni"},
            { "data": "relatori"},
            { "data": "descrizione"}
        ],
        order: [[1, 'asc']],
        select: true,
        buttons: [
            { extend: "create", editor: editor}
        ]
    } );

    $('#tabellaEventi').on( 'click', 'td.details-control', function () {
        var tr = this.parentNode;

        if ( table.row( tr ).child.isShown() ) {
            editor.close();
        }
        else {
            editor.edit(
                tr,
                'Modifica Evento',
                [
                    {
                        "className": "delete",
                        "label": "Elimina Evento",
                        "fn": function () {
                            // Close the edit display and delete the row immediately
                            editor.close();
                            editor.remove( tr, '', null, false );
                            editor.submit();
                        }
                    }, {
                    "label": "Modifica Evento",
                    "fn": function () {
                        editor.submit();
                    }
                }
                ]
            );
        }
    } );
} );