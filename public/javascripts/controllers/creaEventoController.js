$(function() {
    $('#datetimepicker1').datetimepicker();
});

function bs_input_file() {
    $(".input-file").before(
        function() {
            if ( ! $(this).prev().hasClass('input-ghost') ) {
                var element = $("<input type='file' class='input-ghost' onchange='encodeImageFileAsURL(this)' style='visibility:hidden; height:0'>");
                element.attr("name",$(this).attr("name"));
                element.change(function(){
                    element.next(element).find('input').val((element.val()).split('\\').pop());
                });
                $(this).find("button.btn-choose").click(function(){
                    element.click();
                });
                $(this).find("button.btn-reset").click(function(){
                    element.val(null);
                    $(this).parents(".input-file").find('input').val('');
                });
                $(this).find('input').css("cursor","pointer");
                $(this).find('input').mousedown(function() {
                    $(this).parents('.input-file').prev().click();
                    return false;
                });
                return element;
            }
        }
    );
}

$(function() {
    bs_input_file();
});

var datiEvento = {
    'titolo' : '' ,
    'sottotitolo' : '' ,
    'data' : '' ,
    'luogo' : '' ,
    'informazioni' : '' ,
    'relatori' : '' ,
    'descrizione' : '' ,
    'immagine' : ''
};

function encodeImageFileAsURL(element) {
    var file = element.files[0];
    var reader = new FileReader();
    reader.onloadend = function() {
        datiEvento['immagine']= reader.result;
    };
    reader.readAsDataURL(file);
}

function salvaDati(){

    datiEvento.titolo = $('#titoloEvento').val();
    datiEvento.sottotitolo = $('#sottotitoloEvento').val();
    datiEvento.data = $('#datetimepicker1').data();
    datiEvento.luogo = $('#luogoEvento').val();
    datiEvento.informazioni = $('#informazioniEvento').val();
    datiEvento.relatori = $('#relatoriEvento').val();
    datiEvento.descrizione = $('#descrizioneEvento').val();

    $.ajax({
        url: '/salvaEvento',
        type: 'POST',
        data: JSON.stringify(datiEvento),
        cache: false,
        contentType: 'application/json',
        success: function(data) {
            alert('Inserimento effettuato con Successo!');
            $('#titoloEvento').val('');
            $('#sottotitoloEvento').val('');
            $('#luogoEvento').val('');
            $('#informazioniEvento').val('');
            $('#relatoriEvento').val('');
            $('#descrizioneEvento').val('');
        },
        faliure: function(data) {
            alert('Inserire tutti i CAMPI!');
        }
    });

}