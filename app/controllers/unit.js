const Unit = require('../models/unit');

const unitController = {
  getAll: (req, res, next) => {
    Unit.fetchAll()
      .then(units => {
        res.json({ units });
      })
      .catch(err => next(err));
  },
};

module.exports = unitController;
