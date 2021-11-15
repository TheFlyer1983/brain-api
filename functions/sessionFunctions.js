const jwt = require('jsonwebtoken');
const redis = require('redis');
// Setup Redis:
const redisClient = redis.createClient(process.env.REDIS_URL);

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, 'JWT_SECRET', { expiresIn: '2 days' });
};

const setToken = (key, value) => {
  return Promise.resolve(redisClient.set(key, value));
};

const getAuthTokenId = (req, res) => {
  const { authorization } = req.headers;
  return redisClient.get(authorization, (err, reply) => {
    console.log(process.env.REDIS_URL)
    if (err || !reply) {
      return res.status(400).json('Unauthorized');
    }
    return res.json({ id: reply });
  });
};

module.exports = {
  signToken,
  setToken,
  getAuthTokenId,
  redisClient,
}