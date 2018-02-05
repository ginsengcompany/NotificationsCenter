var config = [];
var multiUser = {
    cod_org: 'omceoce',
    tb_contatti: 'tb_landing_evento',
    tb_eventi: 'tb_medici_iscritti',
    tb_notifiche: 'tb_stato_notifiche'
};
config.push(multiUser);

var multiUser1 = {
    cod_org: 'admin',
    tb_contatti: 'tb_evento_admin',
    tb_eventi: 'tb_eventi_admin',
    tb_notifiche: 'tb_notifiche_admin'
};
config.push(multiUser1);


module.exports = config;
