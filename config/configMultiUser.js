'use strict';
var config = {
    data: []
};
var multiUser = {
    cod_org: 'omceoce',
    tb_contatti: 'tb_medici_iscritti',
    tb_eventi: 'tb_landing_evento',
    tb_notifiche: 'tb_stato_notifiche'
};
config.data.push(multiUser);

var multiUser1 = {
    cod_org: 'admin',
    tb_contatti: 'tb_contatti_admin',
    tb_eventi: 'tb_evento_admin',
    tb_notifiche: 'tb_notifiche_admin'
};
config.data.push(multiUser1);


module.exports =  config;

