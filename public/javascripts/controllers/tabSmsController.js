$(document).ready(function() {

    var tabellaEmail = $('#tabellaSms').DataTable( {
        ajax: "/getNotificheSms",
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
            { "data": "numero_telefono"},
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