$(document).ready(function() {

    var tabellaEmail = $('#tabellaEmail').DataTable( {
        initComplete: function () {
            this.api().columns([4, 5]).every( function () {
                var column = this;
                var select = $('<select><option value=""></option></select>')
                    .appendTo( $(column.footer()).empty() )
                    .on( 'change', function () {
                        var val = $.fn.dataTable.util.escapeRegex(
                            $(this).val()
                        );

                        column
                            .search( val ? '^'+val+'$' : '', true, false )
                            .draw();
                    } );

                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' )
                } );
            } );
        },
        ajax: "/getNotificheEmail",
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
            { "data": "provincia"},
            { "data": "mail"},
            { "data": "titolo"},
            { "data": "sottotitolo"},
            { "data": "stato" , "render": function (data) {
                if (data === true) {
                    return '<span style="color:green; padding-right:3px; padding-top: 3px;">Inviato <img class="manImg" src="../../images/check.png"></img> </span>';
                }

            }}
        ]
    } );



} );