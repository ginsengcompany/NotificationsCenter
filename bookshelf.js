const knex = require('knex')({
  client: 'pg',
  connection: {
    host     : 'localhost',
    user     : 'postgres',
    password : 'postgres',
    database : 'notificationsCenter',
    charset  : 'utf8'
  }
});

module.exports = require('bookshelf')(knex);