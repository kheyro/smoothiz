const Smoothy = require('../models/smoothy');

const smoothyController = {
  createSmoothy: (req, res, next) => {
    const {
      name,
      description,
      recipe,
      visibility,
      user_id,
      category_ids
    } = req.body;

    Smoothy.forge({ name, description, recipe, visibility, user_id })
      .save()
      .then(smoothy => {
        smoothy.categories().attach(category_ids);
        res.status(201).send({
          smoothy: smoothy.id,
        });
      })
      .catch(err => next(err));
  },
};

module.exports = smoothyController;
