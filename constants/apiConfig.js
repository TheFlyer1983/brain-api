const apiConfig = {
  rank: process.env.RANK_API,
};

const endpoints = {
  rank: '/rank'
}

const apiKeys = {
  clarifai: process.env.CLARIFAI_API_KEY
}

module.exports = {
  apiConfig,
  endpoints,
  apiKeys,
}