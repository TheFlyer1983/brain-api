const Clarifai = require('clarifai');
const { apiKeys } = require('../constants');

const app = new Clarifai.App({
  apiKey: apiKeys.clarifai,
});

const handleApiCall = (req, res) => {
  const { input } = req.body;
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, input)
    .then((data) => {
      res.json(data.outputs[0].data.regions);
    })
    .catch((err) => res.status(400).json('Unable to work with API'));
};

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users')
    .where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then((entries) => {
      res.json({ entries: Number(entries[0]) });
    })
    .catch((err) => res.status(400).json('Unable to get entries'));
};

module.exports = {
  handleImage,
  handleApiCall,
};
