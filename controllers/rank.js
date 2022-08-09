const axios = require('axios').default;
const { apiConfig, endpoints } = require('../constants');

const client = axios.create();

const getRank = async (req, res) => {
  const { entries } = req.body;
  try {
    const response = await client.get(
      `${apiConfig.rank}${endpoints.rank}?rank=${entries}`
    );

    return await res.json(response.data.input);
  } catch (error) {
    return await res.status(400).json(error);
  }
};

module.exports = {
  getRank
};
