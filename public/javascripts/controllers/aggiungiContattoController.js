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
            alert('Inserimento effettuato con Successo!');
        },
        faliure: function(data) {
            alert('Inserire tutti i CAMPI!');
        }
    });
}