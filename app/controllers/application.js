const appController = {
  getIndex: (req, res) => {
    res.send({ message: 'secret message' });
  }
};

module.exports = appController;