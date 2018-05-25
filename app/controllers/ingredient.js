const Ingredient = require('../models/ingredient');

const ingredientController = {
  getAll: (req, res, next) => {
    Ingredient.fetchAll()
      .then(ingredients => {
        res.json({ ingredients });
      })
      .catch(err => next(err));
  },
};

module.exports = ingredientController;
