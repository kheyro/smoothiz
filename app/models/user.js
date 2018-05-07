const bookshelf = require('../../config/bookshelf');
const bcrypt = require('bcrypt');

const User = bookshelf.Model.extend({
  tableName: 'users',
  initialize() {
    this.on('creating', this.encryptPassword);
  },
  encryptPassword: model =>
    new Promise((resolve, reject) =>
      bcrypt.hash(model.attributes.password, 10, (err, hash) => {
        if (err) reject(err);
        model.set('password', hash);
        resolve(hash);
      })
    ),
});

module.exports = bookshelf.model('User', User);
