$(document).ready(function() {

   var tabNotifiche = $('#tabellaNotifiche').DataTable( {
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
            { "data": "provincia"},
            { "data": "titolo" },
            { "data": "sottotitolo"},
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
                    return '<span style="color:red; padding-right:3px; padding-top: 3px;">Non confermato<img class="manImg" src="../../images/delete.png"></img></span>';
                }
                if (data===true) {
                    return '<span style="color:green; padding-right:3px; padding-top: 3px;">Confermato<img class="manImg" src="../../images/check.png"></img></span>';
                }
            }},
            { "data": "eliminato" , "render": function (data) {
                var color = 'black';
                if (data===false) {
                    return '<span style="color:red; padding-right:3px; padding-top: 3px;">Non Eliminato<img class="manImg" src="../../images/delete.png"></img></span>';
                }
                if (data===true) {
                    return '<span style="color:green; padding-right:3px; padding-top: 3px;">Eliminato<img class="manImg" src="../../images/check.png"></img></span>';
                }
            }}
        ]
    } );



} );