const sessionFunctions = require('../functions/sessionFunctions')

const handleSignin = (db, bcrypt, req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    // return res.status(400).json('Incorrect Form Submission');
    return Promise.reject('Incorrect Form Submission');
  }
  return db
    .select('email', 'hash')
    .from('login')
    .where('email', '=', req.body.email)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        return db
          .select('*')
          .from('users')
          .where('email', '=', email)
          .then((user) => user[0])
          .catch((err) => Promise.reject('Unable to get user'));
      } else {
        Promise.reject('Wrong Credentials');
      }
    })
    .catch((err) => Promise.reject('Wrong Credentials'));
};

const createSessions = (user) => {
  const { email, id } = user;
  const token = sessionFunctions.signToken(email);
  return sessionFunctions.setToken(token, id)
    .then(() => {
      return { success: 'true', userId: id, token };
    })
    .catch(console.log);
};

const signinAuthentication = (db, bcrypt) => (req, res) => {
  const { authorization } = req.headers;
  return authorization
    ? sessionFunctions.getAuthTokenId(req, res)
    : handleSignin(db, bcrypt, req, res)
        .then((data) => {
          return data.id && data.email ? createSessions(data) : Promise.reject(data);
        })
        .then((session) => res.json(session))
        .catch((err) => res.status(400).json(err));
};

module.exports = {
  signinAuthentication,
};
