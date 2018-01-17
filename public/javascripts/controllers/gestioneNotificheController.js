$(document).ready(function() {

   tabNotifiche = $('#tabellaNotifiche').DataTable( {
       initComplete: function () {
        this.api().columns([4,5,7]).every( function () {
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
           this.api().columns([9,10,6]).every( function () {
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
       buttons: [
           {
               extend: 'excel',
               text: 'Excel',
               exportOptions: {
                   columns: ':visible'
               }
           },
           {
               extend: 'pdfHtml5',
               text: 'PDF',
               orientation: 'landscape',
               exportOptions: {
                   columns: ':visible'
               }
           },
           {
               extend: 'print',
               text: 'Stampa',
               exportOptions: {
                   columns: ':visible'
               }
           }
       ],
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
           { "data": "tipo" },
           { "data": "stato" , "render": function (data) {
               if (data === true) {
                   return '<span style="color:green; padding-right:3px; padding-top: 3px;">Inviato <img class="manImg" src="../../images/check.png"></img> </span>';
               }

           }},
           { "data": "confermato" , "render": function (data) {
               var color = 'black';
               if (data===false) {
                   return '<span style="color:red; padding-right:3px; padding-top: 3px;"><button onclick="switchConfermatoEmail();">No - Clicca per Confermare</button> </span>';
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

var datiSwitch= {
    'confermato': true,
    'eliminato': false,
    '_id_medico': '',
    '_id_evento': ''
};

function switchConfermatoEmail(dataSwitch) {

    $('#tabellaNotifiche tbody').on( 'click', 'button', function () {
        var dati = tabNotifiche.row( $(this).parents('tr') ).data();
        switchConfermatoEmail(dati);
    } );

    if(dataSwitch!== undefined){
        datiSwitch._id_medico = dataSwitch._id_medico;
        datiSwitch._id_evento = dataSwitch._id_evento;
        $.ajax({
            url: '/switchConfermatoEmail',
            type: 'POST',
            data: JSON.stringify(datiSwitch),
            cache: false,
            contentType: 'application/json',
            success: function(data) {

                if(data.errore===false){

                    tabNotifiche.ajax.reload();

                }

            },
            faliure: function(data) {

            }
        });
    }

}

function exportExcel(){
    tabNotifiche.buttons('.buttons-excel').trigger();
}

function exportPdf(){
    tabNotifiche.buttons('.buttons-pdf').trigger();
}

function exportStampa(){
    tabNotifiche.buttons('.buttons-print').trigger();
}