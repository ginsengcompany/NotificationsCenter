'use strict';
var config = {
    data: []
};
var multiUser = {
    cod_org: 'omceoce',
    descrizione: 'Ordine Medici Caserta',
    tb_contatti: 'tb_contatti_omceoce',
    tb_eventi: 'tb_evento_omceoce',
    tb_notifiche: 'tb_notifiche_omceoce'
};
config.data.push(multiUser);

var multiUser1 = {
    cod_org: 'admin',
    descrizione: 'Amministrazione',
    tb_contatti: 'tb_contatti_admin',
    tb_eventi: 'tb_evento_admin',
    tb_notifiche: 'tb_notifiche_admin'
};
config.data.push(multiUser1);


module.exports =  config;

