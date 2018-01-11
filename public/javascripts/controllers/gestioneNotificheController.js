$(document).ready(function() {

   var tabNotifiche = $('#tabellaNotifiche').DataTable( {
       initComplete: function () {
        this.api().columns([4,5]).every( function () {
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
           this.api().columns([8,9,6]).every( function () {
               var column = this;
               var title = $(this).text();
               var input = $('<input type="text" placeholder="Ricerca '+title+'" />')
                   .appendTo( $(column.footer()).empty() )
                   .on('keyup change', function () {
                       if ( column.search() !== this.value ) {
                           column
                               .search( this.value )
                               .draw();
                       }
                   } );

           } );
    },
        ajax: "/getNotifiche",
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
            { "data": "titolo" },
            { "data": "data_invio" , "render": function (data) {
                var date = new Date(data);
                var month = date.getMonth() + 1;
                return date.getDate() + "/" + (month.length < 10 ? "0" + month : month) + "/" + date.getFullYear();
            }},
            { "data": "stato" , "render": function (data) {
                if (data === true) {
                    return '<span style="color:green; padding-right:3px; padding-top: 3px;">Inviato <img class="manImg" src="../../images/check.png"></img> </span>';
                }

            }},
            { "data": "confermato" , "render": function (data) {
                var color = 'black';
                if (data===false) {
                    return '<span style="color:red; padding-right:3px; padding-top: 3px;">No <img class="manImg" src="../../images/delete.png"></img></span>';
                }
                if (data===true) {
                    return '<span style="color:green; padding-right:3px; padding-top: 3px;">Si <img class="manImg" src="../../images/check.png"></img></span>';
                }
            }},
            { "data": "eliminato" , "render": function (data) {
                var color = 'black';
                if (data===false) {
                    return '<span style="color:red; padding-right:3px; padding-top: 3px;">No <img class="manImg" src="../../images/delete.png"></img></span>';
                }
                if (data===true) {
                    return '<span style="color:green; padding-right:3px; padding-top: 3px;">Si <img class="manImg" src="../../images/check.png"></img></span>';
                }
            }}
        ]
    } );

} );