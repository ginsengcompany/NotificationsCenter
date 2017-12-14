var datiLogin = {
    'email' : '' ,
    'password' : ''
};

function loginEffettuatoConSuccesso(){

    datiLogin.email = $('#inputEmail').val();
    datiLogin.password = $('#inputPassword').val();

    $.ajax({
        url: '/authRegister',
        type: 'POST',
        data: JSON.stringify(datiLogin),
        cache: false,
        contentType: 'application/json',
        success: function(data) {

            window.location.href('/home?'+data.token)

        },
        faliure: function(data) {

        }
    });

}
