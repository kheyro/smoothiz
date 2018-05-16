const User = require('../models/user');

const userController = {
  getUser: (req, res, next) => {
    const userId = req.params.id;
    return User.forge({ id: userId })
      .fetch({ withRelated: ['smoothies'] })
      .then(user => {
        const filteredUser = user;
        delete filteredUser.attributes.password;
        delete filteredUser.attributes.email;
        delete filteredUser.attributes.birthday;
        res.json({ user: filteredUser });
      })
      .catch(err => next(err));
  },
};

module.exports = userController;
