var editor;

$(document).ready(function () {
    $('#PersonTableContainer').jtable({
        title: 'Table of people',
        actions: {
            listAction: '/postGetEventi',
            //createAction: '/GettingStarted/CreatePerson',
            updateAction: '/getUpdateEventi',
            deleteAction: '/getDeleteEventi'
        },
        fields: {
            _id: {
                key: true,
                list: false
            },
            titolo: {
                title: 'Titolo',
                width: '10%'
            },
            sottotitolo: {
                title: 'Sottotitolo',
                width: '10%'
            },
            luogo: {
                title: 'Luogo',
                width: '10%'
            },
            data: {
                title: 'Data Inizio',
                width: '10%'
            },
            data_fine: {
                title: 'Data Fine',
                width: '10%'
            },
            informazioni: {
                title: 'Informazioni:',
                width: '20%'
            },
            relatori: {
                title: 'Relatori:',
                width: '20%'
            },
            descrizione: {
                title: 'Descrizione:',
                width: '20%'
            }
        }
    });
    $('#PersonTableContainer').jtable('load');
});


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