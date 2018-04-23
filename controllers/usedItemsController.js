const usedItemsDB = require('../models/usedItemsDB');

module.exports = {

  usedItemsIndex(req, res, next) {
    usedItemsDB.findAll()
      .then((usedItems) => {
        res.status(200).json({
          message: 'usedItems data loaded',
          usedItems
        });
      })
      .catch(err => next(err));
  },

  usedItemsGetOne(req, res, next) {
    usedItemsDB.findById(req.params.id)
      .then((usedItem) => {
        res.json({
          message: 'Find one usedItems',
          usedItem
        })
      }).catch(err => next(err));
  },

  usedItemsCreate(req, res, next) {
    console.log(req.body)
    for (let key in req.body) {
      console.log(key)
    }
  },

  usedItemsUpdate(req, res, next) {
    usedItemsDB.update(req.body)
      .then((usedItem) => {
        res.json({
          message: 'usedItems updated',
          usedItem
        })
      })
      .catch(err => next(err));
  },

  usedItemsDestroy(req, res, next) {
    usedItemsDB.destroy(req.params.id)
    .then(() => {
      res.json({
        message: 'usedItem has been deleted',
      })
    })
    .catch (err => next(err));
  }

};
