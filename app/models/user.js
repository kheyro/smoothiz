const bcrypt = require('bcrypt');
const bookshelf = require('../../config/bookshelf');
const Smoothy = require('./smoothy');

const User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true,
  initialize() {
    this.on('creating', this.encryptPassword);
  },
  smoothies: function() {
    return this.hasMany(Smoothy);
  },
  likeSmoothies: function() {
    return this.belongsToMany('Smoothy', 'likes');
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
