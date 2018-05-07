const bookshelf = require('../../config/bookshelf');
const bcrypt = require('bcrypt');

const User = bookshelf.Model.extend({
  tableName: 'users',
  initialize() {
    this.on('creating', this.encryptPassword);
  },
  encryptPassword: model =>
    bcrypt
      .hash(model.attributes.password, 10)
      .then(hash => model.set('password', hash))
      .catch(err => err),
  // encryptPassword: model =>
  //   new Promise((resolve, reject) =>
  //     bcrypt.hash(model.attributes.password, 10, (err, hash) => {
  //       if (err) reject(err);
  //       model.set('password', hash);
  //       resolve(hash);
  //     })
  //   ),
  validatePassword(suppliedPassword) {
    return bcrypt
      .compare(suppliedPassword, this.attributes.password)
      .then(res => res)
      .catch(err => err);
  },
});

module.exports = bookshelf.model('User', User);
