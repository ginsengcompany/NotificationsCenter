$(document).ready(function() {

    var tabellaApp = $('#tabellaApp').DataTable( {
        ajax: "/getMedici",
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
            { "data": "token" , "render": function (data) {
                if (data!==""||data!==''||data!==null||data!==undefined) {
                    return '<span style="color:green; padding-right:3px; padding-top: 3px;">App scaricata<img class="manImg" src="../../images/check.png"></img></span>';
                }
                if (data===""||data===''||data===null||data===undefined) {
                    return '<span style="color:red; padding-right:3px; padding-top: 3px;">App non scaricata<img class="manImg" src="../../images/delete.png"></img></span>';
                }
            }}
        ]
    } );



} );