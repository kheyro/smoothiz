const User = require('../models/user');

const authenticationController = {
  signUp: (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(406)
        .send({ error: 'You must provide email and password.' });
    }

    return User.forge({ email })
      .fetch()
      .then(model => {
        if (model) {
          return res.status(406).send({ error: 'email already in use.' });
        }
        return User.forge({ email, password })
          .save()
          .then(user => res.status(201).send({ success: true, user }))
          .catch(err => next(err));
      });
  },
};

module.exports = authenticationController;
