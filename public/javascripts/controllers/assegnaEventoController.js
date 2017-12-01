var arrayMedici = [];
var arrayEventi = [];

$("#tabellaMedici").bootgrid({
    ajax: true,
    ajaxSettings: {
        method: "GET",
        cache: false
    },
    url: "/getMedici",
    selection: true,
    multiSelect: true,
    rowSelect: true,
    keepSelection: true,
    formatters: {
        "_id": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "matricola": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "cognome": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "nome": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "specializzazione": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "citta": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "mail": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        }
    }
}).on("selected.rs.jquery.bootgrid", function(e, rows)
{
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i]._id);
    }
});

$("#tabellaEventi").bootgrid({
    ajax: true,
    ajaxSettings: {
        method: "GET",
        cache: false
    },
    url: "/getEventi",
    selection: true,
    multiSelect: false,
    rowSelect: true,
    keepSelection: true,
    formatters: {
        "_id": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "titolo": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "sottotitolo": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "data": function (column, row) {
            return "<span title=\"" + row[column.id].substr(0,10) + "\">" + row[column.id].substr(0,10) + "</span>";
        },
        "luogo": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "informazioni": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "relatori": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        },
        "descrizione": function (column, row) {
            return "<span title=\"" + row[column.id] + "\">" + row[column.id] + "</span>";
        }
    }
}).on("selected.rs.jquery.bootgrid", function(e, rows)
{
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i]._id);
    }
});

function salvaDati(){

     var rows =  $("#tabellaMedici").bootgrid("getSelectedRows");
    console.log(rows);

    /*$.ajax({
        url: '/assegnaEvento',
        type: 'POST',
        data: JSON.stringify(''),
        cache: false,
        contentType: 'application/json',
        success: function(data) {
            alert('Assegnazione effettuata con Successo!');
        },
        faliure: function(data) {
            alert('Inserire tutti i CAMPI!');
        }
    });*/

}