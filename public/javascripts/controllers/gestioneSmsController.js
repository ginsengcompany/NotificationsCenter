function salvaDati(){

    datiSms = {numeroTel:'+393409232116'};

    $.ajax({
        url: '/sendSms',
        type: 'POST',
        data: JSON.stringify(datiSms),
        cache: false,
        contentType: 'application/json',
        success: function(data) {


        },
        faliure: function(data) {

        }
    });

}