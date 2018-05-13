const Category = require('../models/category');

const categoryController = {
  getAll: (req, res, next) => {
    Category
      .fetchAll()
      .then(categories => {
        res.json({ categories });
      })
      .catch(err => next(err));
  },
};

module.exports = categoryController;
