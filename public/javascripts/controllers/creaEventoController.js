$(function() {
    $('#datetimepicker1').datetimepicker();
    $('#datetimepicker2').datetimepicker();
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
    'dataFine' : '' ,
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
    datiEvento.dataFine = $('#datetimepicker2').data();
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

            $('#titoloEvento').val('');
            $('#sottotitoloEvento').val('');
            $('#luogoEvento').val('');
            $('#informazioniEvento').val('');
            $('#relatoriEvento').val('');
            $('#descrizioneEvento').val('');
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