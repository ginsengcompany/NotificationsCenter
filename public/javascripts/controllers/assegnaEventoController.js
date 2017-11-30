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
    keepSelection: true
}).on("selected.rs.jquery.bootgrid", function(e, rows)
{
    $('[data-toggle="tooltip"]').tooltip();
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i].id);
    }
    alert("Select: " + rowIds.join(","));
}).on("deselected.rs.jquery.bootgrid", function(e, rows)
{
    $('[data-toggle="tooltip"]').tooltip();
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i].id);
    }
    alert("Deselect: " + rowIds.join(","));
});

$("#tabellaEventi").bootgrid({
    ajax: true,
    ajaxSettings: {
        method: "GET",
        cache: false
    },
    url: "/getEventi",
    selection: true,
    multiSelect: true,
    rowSelect: true,
    keepSelection: true
}).on("selected.rs.jquery.bootgrid", function(e, rows)
{
    $('[data-toggle="tooltip"]').tooltip();
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i]._id);
    }
    alert("Select: " + rowIds.join(","));
}).on("deselected.rs.jquery.bootgrid", function(e, rows)
{
    $('[data-toggle="tooltip"]').tooltip();
    var rowIds = [];
    for (var i = 0; i < rows.length; i++)
    {
        rowIds.push(rows[i]._id);
    }
    alert("Deselect: " + rowIds.join(","));
});