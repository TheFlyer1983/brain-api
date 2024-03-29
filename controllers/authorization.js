const redisClient = require('../functions/sessionFunctions').redisClient;

const requireAuth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json('Unauthorised');
  }
  return redisClient.get(authorization, (err, reply) => {
    if (err || !reply) {
      return res.status(401).json('Unauthorized');
    }
    console.log('You shall pass');
    return next();
  });
};

module.exports = {
  requireAuth,
};
