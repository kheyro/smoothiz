const jwt = require('jsonwebtoken');

const User = require('../models/user');

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.sign({ sub: user.id, iat: timestamp }, process.env.JWT_SECRET);
}

const authenticationController = {
  signIn: (req, res) => {
    const { user } = req;
    res.json({
      token: tokenForUser(user),
      user: {
        id: user.id,
        firstname: user.attributes.firstname,
        lastname: user.attributes.lastname,
      },
    });
  },
  signUp: (req, res, next) => {
    const { firstname, lastname, email, password, birthday } = req.body;
    if (!email || !password) {
      return res
        .status(406)
        .send({ error: 'You must provide email and password.' });
    }

    return User.forge({ email })
      .fetch()
      .then(model => {
        if (model) {
          return res.status(406).json({ error: 'email already in use.' });
        }
        return User.forge({ firstname, lastname, email, password, birthday })
          .save()
          .then(user =>
            res.status(201).send({
              token: tokenForUser(user),
              user: {
                id: user.id,
                firstname: user.attributes.firstname,
                lastname: user.attributes.lastname,
              },
            })
          )
          .catch(err => next(err));
      });
  },
};

module.exports = authenticationController;
