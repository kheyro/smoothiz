const User = require('../models/user');
const jwt = require('jsonwebtoken');

const userController = {
  getUser: (req, res, next) => {
    const userId = req.params.id;
    let loggedIn = false;

    // retrieve token if any
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err || decoded === 'undefined' || decoded.sub.toString() !== req.params.id.toString()) {
          // return only the public smoothies
          loggedIn = false;
          return console.log('not valid', err);
        } else {
          loggedIn = true;
          // return all smoothies including private smoothies
          return console.log('valid', decoded);
        }
      });
    }

    return User.forge({ id: userId })
      .fetch({
        withRelated: [
          { smoothies: qb => loggedIn ? qb : qb.where('visibility', 0), },
          'smoothies.categories',
          'likeSmoothies',
          { 'likeSmoothies.likeUsers': qb => qb.column('user_id') },
          'smoothies.quantities',
          { 'smoothies.likeUsers': qb => qb.column('user_id') },
        ],
      })
      .then(user => {
        const filteredUser = user;
        delete filteredUser.attributes.password;
        delete filteredUser.attributes.email;
        delete filteredUser.attributes.birthday;
        res.json(filteredUser);
      })
      .catch(err => next(err));
  },
};

module.exports = userController;
