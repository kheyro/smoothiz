const Smoothy = require('../models/smoothy');

const smoothyController = {
  createSmoothy: (req, res, next) => {
    const { name, description, recipe, visibility } = req.body;
    const user_id = req.user.id; // user data sent from passport
    const category_ids = req.body.categoryIds;
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
  editSmoothie: (req, res, next) => {
    const { name, description, recipe, visibility } = req.body;
    const smoothieId = req.params.id;
    const user_id = req.user.id; // user data sent from passport
    const category_ids = req.body.categoryIds;
    // make sure it belongs to the right user requesting change
    Smoothy.forge({ id: smoothieId })
      .fetch()
      .then(smt => {
        if (smt.attributes.user_id !== user_id) res.sendStatus(401);
      })
      .catch(err => next(err));
    Smoothy.forge({
      id: smoothieId,
      name,
      description,
      recipe,
      visibility,
      user_id: 1,
    })
      .save()
      .then(smoothy => {
        // Delete all categories and re-add them
        smoothy
          .categories()
          .detach()
          .then(() => smoothy.categories().attach(category_ids))
          .catch(err => next(err));
        res.status(200).send({
          smoothy: smoothy.id,
        });
      })
      .catch(err => next(err));
  },
};

module.exports = smoothyController;
