const Smoothy = require('../models/smoothy');
const Category = require('../models/category');
const Promise = require('bluebird');
const sharp = require('sharp');
const fs = require('fs');

const smoothyController = {
  getSmoothie: (req, res, next) => {
    const smoothieId = +req.params.id;
    Smoothy.forge({ id: smoothieId })
      .fetch({
        withRelated: [
          { user: qb => qb.column('id', 'firstname', 'lastname') },
          'categories',
          { likeUsers: qb => qb.column('user_id') },
          'quantities',
          'quantities.ingredient',
          'quantities.unit',
        ],
      })
      .then(smoothie => {
        return smoothie
          .set({ views: smoothie.attributes.views + 1 })
          .save()
          .then(updatedSmoothie => {
            console.log(updatedSmoothie.toJSON());
            res.json({ smoothie: updatedSmoothie });
          })
          .catch(err => next(err));
      })
      .catch(err => next(err));
  },
  getSmoothies: (req, res, next) => {
    if (req.params.categoryId) {
      return Category.where({ id: +req.params.categoryId })
        .fetch({
          withRelated: [
            {
              smoothies: qb => qb.where('visibility', 0).orderByRaw('created_at DESC'),
            },
          ],
        })
        .then(category => {
          const smoothies = category.related('smoothies');
          res.json({ smoothies });
        })
        .catch(err => next(err));
    }
    return Smoothy.where({ visibility: 0 })
      .query(qb => qb.orderByRaw('created_at DESC'))
      .fetchAll()
      .then(smoothies => res.json({ smoothies }))
      .catch(err => next(err));
  },
  createSmoothie: (req, res, next) => {
    const smoothie = JSON.parse(req.body.smoothie);
    const { name, description, recipe, visibility } = smoothie;
    const user_id = req.user.id; // user data sent from passport
    const quantities = smoothie.ingredients;
    const pictures = req.file ? req.file.filename : '';
    // reformat property name
    for (let i = 0; i < quantities.length; i += 1) {
      quantities[i].unit_id = quantities[i].unitId;
      quantities[i].ingredient_id = quantities[i].ingredientId;
      delete quantities[i].unitId;
      delete quantities[i].ingredientId;
    }
    const category_ids = smoothie.categoryIds;
    Smoothy.forge({
      name,
      description,
      recipe,
      visibility,
      user_id,
      pictures,
    })
      .save()
      .tap(smoothy =>
        Promise.map(quantities, quantity =>
          smoothy.related('quantities').create(quantity)
        )
      )
      .then(smoothy => {
        smoothy.categories().attach(category_ids);
        if (req.file) {
          sharp(req.file.path)
            .resize(1000, 1000)
            .toFile(`${req.file.destination}r/${req.file.filename}`, err => {
              if (err) next(err);
            });
        }
        res.status(201).send({
          smoothy: smoothy.id,
        });
      })
      .catch(err => next(err));
  },
  editSmoothie: (req, res, next) => {
    const smoothie = JSON.parse(req.body.smoothie);
    const { name, description, recipe, visibility, editPictures } = smoothie;
    const smoothieId = req.params.id;
    const user_id = req.user.id; // user data sent from passport
    const category_ids = smoothie.categoryIds;
    const quantities = smoothie.ingredients;
    const pictures = req.file ? req.file.filename : '';
    // reformat property name
    for (let i = 0; i < quantities.length; i += 1) {
      quantities[i].unit_id = quantities[i].unitId;
      quantities[i].ingredient_id = quantities[i].ingredientId;
      delete quantities[i].unitId;
      delete quantities[i].ingredientId;
    }
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
      user_id,
    })
      .save()
      .tap(smoothie =>
        Promise.map(quantities, quantity =>
          smoothie.related('quantities').create(quantity)
        )
      )
      .then(smoothy => {
        // Delete all categories and re-add them
        smoothy
          .categories()
          .detach()
          .then(() => smoothy.categories().attach(category_ids))
          .catch(err => next(err));
        if (pictures) {
          smoothy.set('pictures', pictures).save();
          sharp(req.file.path)
            .resize(1000, 1000)
            .toFile(`${req.file.destination}r/${req.file.filename}`, err => {
              if (err) next(err);
            });
          // delete previous pictures
          fs.unlink(`./uploads/smoothie/${editPictures}`, err => {
            if (err) next(err);
          });
          fs.unlink(`./uploads/smoothie/r/${editPictures}`, err => {
            if (err) next(err);
          });
        }
        res.status(200).send({
          smoothy: smoothy.id,
        });
      })
      .catch(err => next(err));
  },
  deleteSmoothie: (req, res, next) => {
    const smoothieId = req.params.id;
    const user_id = req.user.id; // user data sent from passport
    let pictures;
    // Check user ownership
    Smoothy.forge({ id: smoothieId })
      .fetch()
      .then(smt => {
        if (smt.attributes.user_id !== user_id) res.sendStatus(401);
        ({ pictures } = smt.attributes);
      })
      .catch(err => next(err));
    Smoothy.forge({ id: smoothieId })
      .destroy()
      .then(() => {
        // pictures is set from previous fetch
        fs.unlink(`./uploads/smoothie/${pictures}`, err => {
          if (err) next(err);
        });
        fs.unlink(`./uploads/smoothie/r/${pictures}`, err => {
          if (err) next(err);
        });
        res.status(200).json({ success: true });
      })
      .catch(err => next(err));
  },
  likeSmoothie: (req, res, next) => {
    const smoothieId = req.params.id;
    const userId = req.user.id;
    Smoothy.forge({ id: smoothieId })
      .fetch()
      .then(smoothie => {
        smoothie
          .likeUsers()
          .attach(userId)
          .then(() => res.sendStatus(200))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  },
  dislikeSmoothie: (req, res, next) => {
    const smoothieId = req.params.id;
    const userId = req.user.id;
    Smoothy.forge({ id: smoothieId })
      .fetch()
      .then(smoothie => {
        smoothie
          .likeUsers()
          .detach(userId)
          .then(() => res.sendStatus(200))
          .catch(err => next(err));
      })
      .catch(err => next(err));
  },
};

module.exports = smoothyController;
