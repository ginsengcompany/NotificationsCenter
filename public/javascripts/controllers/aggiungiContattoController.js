var datiContatto = {
    'nome' : undefined,
    'cognome' : undefined,
    'specializzazione' : undefined,
    'provincia' : undefined,
    'mail' : undefined,
    'matricola' : undefined,
    'numero_telefono' : undefined,
    'pec' : undefined
};

function salvaDati() {
    datiContatto.nome = $('#nome').val();
    datiContatto.cognome = $('#cognome').val();
    datiContatto.specializzazione = $('#specializzazione').val();
    datiContatto.provincia = $('#provincia').val();
    datiContatto.mail = $('#mail').val();
    datiContatto.matricola = $('#matricola').val();
    datiContatto.numero_telefono = $('#telefono').val();
    datiContatto.pec = $('#pec').val();

    if (
        (datiContatto.nome === null || datiContatto.nome === undefined || datiContatto.nome === '' || datiContatto.nome === "") ||
        (datiContatto.cognome === null || datiContatto.cognome === undefined || datiContatto.cognome === '' || datiContatto.cognome === "") ||
        (datiContatto.specializzazione === null || datiContatto.specializzazione === undefined || datiContatto.specializzazione === '' || datiContatto.specializzazione === "") ||
        (datiContatto.provincia === null || datiContatto.provincia === undefined || datiContatto.provincia === '' || datiContatto.provincia === "") ||
        (datiContatto.mail === null || datiContatto.mail === undefined || datiContatto.mail === '' || datiContatto.mail === "") ||
        (datiContatto.matricola === null || datiContatto.matricola === undefined || datiContatto.matricola === '' || datiContatto.matricola === "") ||
        (datiContatto.numero_telefono === null || datiContatto.numero_telefono === undefined || datiContatto.numero_telefono === '' || datiContatto.numero_telefono === "") ||
        (datiContatto.pec === null || datiContatto.pec === undefined || datiContatto.pec === '' || datiContatto.pec === "")
    ) {
        $("#myModal1").on("show", function () {
            $("#myModal1 a.btn").on("click", function (e) {
                console.log("button pressed");
                $("#myModal1").modal('hide');
            });
        });
        $("#myModal1").on("hide", function () {
            $("#myModal1 a.btn").off("click");
        });

        $("#myModal1").on("hidden", function () {
            $("#myModal1").remove();
        });

        $("#myModal1").modal({
            "backdrop": "static",
            "keyboard": true,
            "show": true
        });
    }
    else {
        $.ajax({
            url: '/salvaContatto',
            type: 'POST',
            data: JSON.stringify(datiContatto),
            cache: false,
            contentType: 'application/json',
            success: function (data) {

                $("#myModal").on("show", function () {
                    $("#myModal a.btn").on("click", function (e) {
                        console.log("button pressed");
                        $("#myModal").modal('hide');
                    });
                });
                $("#myModal").on("hide", function () {
                    $("#myModal a.btn").off("click");
                });

                $("#myModal").on("hidden", function () {
                    $("#myModal").remove();
                });

                $("#myModal").modal({
                    "backdrop": "static",
                    "keyboard": true,
                    "show": true
                });

                $('#nome').val('');
                $('#cognome').val('');
                $('#specializzazione').val('');
                $('#provincia').val('');
                $('#mail').val('');
                $('#matricola').val('');
            },
            faliure: function (data) {
                $("#myModal1").on("show", function () {
                    $("#myModal1 a.btn").on("click", function (e) {
                        console.log("button pressed");
                        $("#myModal1").modal('hide');
                    });
                });
                $("#myModal1").on("hide", function () {
                    $("#myModal1 a.btn").off("click");
                });

                $("#myModal1").on("hidden", function () {
                    $("#myModal1").remove();
                });

                $("#myModal1").modal({
                    "backdrop": "static",
                    "keyboard": true,
                    "show": true
                });
            }
        });
    }
}
