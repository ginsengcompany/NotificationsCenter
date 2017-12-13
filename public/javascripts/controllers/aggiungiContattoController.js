var datiContatto = {
    'nome' : "",
    'cognome' : "",
    'specializzazione' : "",
    'provincia' : "",
    'mail' : "",
    'matricola' : ""
};

function salvaDati() {
    datiContatto.nome = $('#nome').val();
    datiContatto.cognome = $('#cognome').val();
    datiContatto.specializzazione = $('#specializzazione').val();
    datiContatto.provincia = $('#provincia').val();
    datiContatto.mail = $('#mail').val();
    datiContatto.matricola = $('#matricola').val();

    $.ajax({
        url: '/salvaContatto',
        type: 'POST',
        data: JSON.stringify(datiContatto),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            $("#myModal").on("show", function() {
                $("#myModal a.btn").on("click", function(e) {
                    console.log("button pressed");
                    $("#myModal").modal('hide');
                });
            });
            $("#myModal").on("hide", function() {
                $("#myModal a.btn").off("click");
            });

            $("#myModal").on("hidden", function() {
                $("#myModal").remove();
            });

            $("#myModal").modal({
                "backdrop"  : "static",
                "keyboard"  : true,
                "show"      : true
            });

            $('#nome').val('');
            $('#cognome').val('');
            $('#specializzazione').val('');
            $('#provincia').val('');
            $('#mail').val('');
            $('#matricola').val('');
        },
        faliure: function(data) {
            $("#myModal1").on("show", function() {
                $("#myModal1 a.btn").on("click", function(e) {
                    console.log("button pressed");
                    $("#myModal1").modal('hide');
                });
            });
            $("#myModal1").on("hide", function() {
                $("#myModal1 a.btn").off("click");
            });

            $("#myModal1").on("hidden", function() {
                $("#myModal1").remove();
            });

            $("#myModal1").modal({
                "backdrop"  : "static",
                "keyboard"  : true,
                "show"      : true
            });
        }
    });
}