const fetch = require('node-fetch');
const { apiConfig, endpoints } = require('../constants');

const getRank = async (req, res) => {
  const { entries } = req.body;
  try {
    const response = await fetch(`${apiConfig.rank}${endpoints.rank}?rank=${entries}`);
    const result = await response.json(response);
    return await res.json(result);
  } catch (error) {
    return await res.status(400).json(error);
  }
};

module.exports = {
  getRank,
};
