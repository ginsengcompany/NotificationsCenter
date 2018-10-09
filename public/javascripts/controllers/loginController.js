/*$.getScript("https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js", function(){
    particlesJS('particles-js',
        {
            "particles": {
                "number": {
                    "value": 80,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#000000"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    },
                    "image": {
                        "width": 100,
                        "height": 100
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": false,
                    "anim": {
                        "enable": false,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": false,
                        "speed": 40,
                        "size_min": 0.1,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": true,
                    "distance": 150,
                    "color": "#000000",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 6,
                    "direction": "none",
                    "random": false,
                    "straight": false,
                    "out_mode": "out",
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "grab": {
                        "distance": 400,
                        "line_linked": {
                            "opacity": 1
                        }
                    },
                    "bubble": {
                        "distance": 400,
                        "size": 40,
                        "duration": 2,
                        "opacity": 8,
                        "speed": 3
                    },
                    "repulse": {
                        "distance": 200
                    },
                    "push": {
                        "particles_nb": 4
                    },
                    "remove": {
                        "particles_nb": 2
                    }
                }
            },
            "retina_detect": true,
            "config_demo": {
                "hide_card": false,
                "background_color": "#b61924",
                "background_image": "",
                "background_position": "50% 50%",
                "background_repeat": "no-repeat",
                "background_size": "cover"
            }
        }
    );

});*/

let datiLogin = {
    'email' : undefined ,
    'password' : undefined
};

$(document).ready(function() {

    setTimeout(function(){
        $('body').addClass('loaded');
        $('h1').css('color','#222222');
        $("#login-box").css("z-index", "9999");
    }, 1200);

});

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
                $("#modalErroreLogin").on("show.bs.modal", function () {
                    $("#modalErroreLogin a.btn").on("click", function (e) {
                        console.log("button pressed");
                        $("#modalErroreLogin").modal('hide');
                    });
                });
                $("#modalErroreLogin").on("hide.bs.modal", function () {
                    $("#modalErroreLogin a.btn").off("click");
                });

                $("#modalErroreLogin").on("hidden", function () {
                    $("#modalErroreLogin").remove();
                });

                $("#modalErroreLogin").modal({
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
