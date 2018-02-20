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
        });
        this.api().columns([9,10]).every( function () {
            var column = this;
            var select = $('<select style="width: 80px"><option value=""></option></select>')
                .appendTo( $(column.footer()).empty() )
                .on( 'change', function () {

                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column
                        .search( val  )
                        .draw();
                } );

            column.data().unique().sort().each( function ( d, j ) {
                if(d===true){
                    d='Si';
                    select.append( '<option value="'+d+'">'+d+'</option>' );
                }
                if(d===false){
                    d='No';
                    select.append( '<option value="'+d+'">'+d+'</option>' );
                }

            } );

           });
        this.api().columns([8]).every( function () {
            var column = this;
            var select = $('<select style="width: 150px"><option value=""></option></select>')
                .appendTo( $(column.footer()).empty() )
                .on( 'change', function () {

                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                    );

                    column
                        .search( val  )
                        .draw();
                } );

            column.data().unique().sort().each( function ( d, j ) {
                if(d===true){
                    d='Inoltrato';
                    select.append( '<option value="'+d+'">'+d+'</option>' );
                }
                if(d===false){
                    d='Non Inviato';
                    select.append( '<option value="'+d+'">'+d+'</option>' );
                }

            } );
        });
        this.api().columns([6]).every( function () {
            var that = this;
            $( "#datepicker" ).datepicker();
            var select = $('<input type="text" id="datepicker" placeholder="Ricerca" />')
                .appendTo( $(that.footer()).empty() )
                .on( 'keyup change', function () {
                if ( that.search() !== this.value ) {
                    that
                        .search( this.value )
                        .draw();
                }
            } );
           });
    },
       search: { "caseInsensitive": false },
       ajax: "/getNotifiche",
       buttons: [
           {
               extend: 'excel',
               text: 'Excel',
               exportOptions: {
                   columns: ':visible',
                   orthogonal: 'export'
               }
           },
           {
               extend: 'pdfHtml5',
               text: 'PDF',
               orientation: 'landscape',
               exportOptions: {
                   columns: ':visible',
                   orthogonal: 'export'
               }
           },
           {
               extend: 'print',
               text: 'Stampa',
               exportOptions: {
                   columns: ':visible',
                   orthogonal: 'export'
               }
           }
       ],
       scrollCollapse: false,
       paging: true,
       autoWidth: false,
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
               if(data!=='1969-12-31T23:00:00.000Z'){
                   function pad(s) { return (s < 10) ? '0' + s : s; }
                   var d = new Date(data);
                   return [pad(d.getDate()), pad(d.getMonth()+1), d.getFullYear()].join('/');
               }else {
                   return 'Non Disponibile';
               }

           }},
           { "data": "tipo" },
           { "data": "stato" , "render": function (data) {
               if (data === true) {
                   return '<span style="color:green; padding-right:3px; padding-top: 3px;">Inoltrato <img class="manImg" src="../../images/check.png"></img> </span>';
               }
               if (data === false) {
                   return '<span style="color:red; padding-right:3px; padding-top: 3px;">Non Inviato <img class="manImg" src="../../images/delete.png"></img> </span>';
               }

           }},
           { "data": "confermato" , "render": function (data, type) {
               var color = 'black';
               if(type === 'export') {
                   if (data === false) {
                       return type === 'export' ? data = 'No' : data;
                   }
                   if (data === true) {
                       return type === 'export' ? data = 'Si' : data;
                   }
               }
               if (data===false) {
                   return '<span style="color:red; padding-right:3px; padding-top: 3px;"><button id="btnConferma" onclick="switchConfermatoEmail();">No - Clicca per Confermare</button> </span>';
               }
               if (data===true) {
                   return '<span style="color:green; padding-right:3px; padding-top: 3px;">Si <img class="manImg" src="../../images/check.png"></img></span>';
               }
           }},
           { "data": "eliminato" , "render": function (data, type) {
               var color = 'black';
               if(type === 'export'){
                   if (data===false) {
                       return type === 'export' ? data = 'No' : data;
                   }
                   if (data===true) {
                       return type === 'export' ? data = 'Si' : data;
                   }
               }
               if (data===false) {
                   return '<span style="color:red; padding-right:3px; padding-top: 3px;"><button id="btnElimina" onclick="switchEliminatoEmail();">No - Clicca per Eliminare</button> </span>';
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
    '_id_utente': '',
    '_id_evento': ''
};

var datiSwitch1= {
    'confermato': false,
    'eliminato': true,
    '_id_utente': '',
    '_id_evento': ''
};

function switchConfermatoEmail(dataSwitch) {

    $('#tabellaNotifiche tbody').on( 'click', 'button', function () {
        var dati = tabNotifiche.row( $(this).parents('tr') ).data();
        switchConfermatoEmail(dati);
    } );

    if(dataSwitch!== undefined){
        datiSwitch._id_utente = dataSwitch._id_utente;
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

function switchEliminatoEmail(dataSwitch) {

    $('#tabellaNotifiche tbody').on( 'click', 'button', function () {
        var dati = tabNotifiche.row( $(this).parents('tr') ).data();
        switchEliminatoEmail(dati);
    } );

    if(dataSwitch!== undefined){
        datiSwitch1._id_utente = dataSwitch._id_utente;
        datiSwitch1._id_evento = dataSwitch._id_evento;
        $.ajax({
            url: '/switchConfermatoEmail',
            type: 'POST',
            data: JSON.stringify(datiSwitch1),
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