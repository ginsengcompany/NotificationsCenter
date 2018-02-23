let datiLogin = {
    'email' : undefined ,
    'password' : undefined
};

$(document).keypress(function(e) {
    if(e.which == 13) {
        loginEffettuatoConSuccesso();
    }
});

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

            if(data.errore===true){
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
            }else if(data.errore===false){

                $.ajax({
                    url: '/',
                    type: 'POST',
                    data: JSON.stringify({userAuthenticated:true,cod_org:data.id.cod_org}),
                    cache: false,
                    contentType: 'application/json',
                    success: function (data) {

                        window.location.replace('/home');

                    },
                    faliure: function (data) {

                    }
                });

            }

        },
        faliure: function(data) {

        }
    });

}
