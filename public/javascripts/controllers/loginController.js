var datiEvento = {
    'email' : '' ,
    'password' : ''
};

function loginEffettuatoConSuccesso(){

    datiEvento.email = $('#titoloEvento').val();
    datiEvento.password = $('#sottotitoloEvento').val();

    $.ajax({
        url: '/authController/register',
        type: 'GET',
        data: JSON.stringify(datiEvento),
        cache: false,
        contentType: 'application/json',
        success: function(data) {


        },
        faliure: function(data) {

        }
    });

}
