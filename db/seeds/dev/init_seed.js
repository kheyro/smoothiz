const bcrypt = require('bcrypt');
const units = require('../../data/units');
const ingredients = require('../../data/ingredients');
const categories = require('../../data/categories');

exports.seed = (knex, Promise) => {
  function delRestartTbl(tbl) {
    return knex(tbl)
      .del()
      .then(() => knex.raw(`ALTER SEQUENCE ${tbl}_id_seq RESTART WITH 1`));
  }
  return new Promise(r => r('done!'))
    .then(() => {
      delRestartTbl('units');
      delRestartTbl('quantities');
      delRestartTbl('smoothies_categories');
      delRestartTbl('smoothies');
      delRestartTbl('users');
      delRestartTbl('ingredients');
      delRestartTbl('categories');
      delRestartTbl('likes');
    })
    .then(() => knex('units').insert(units))
    .then(() => knex('ingredients').insert(ingredients))
    .then(() => knex('categories').insert(categories))
    .then(() =>
      knex('users').insert({
        firstname: 'John',
        lastname: 'Doe',
        email: 'john@example.com',
        password: bcrypt.hashSync('123', 10),
      })
    );
};
