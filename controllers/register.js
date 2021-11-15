const sessionFunctions = require('../functions/sessionFunctions')

const handleRegister = async (db, bcrypt, details) => {
  const { email, name, password } = details;
  if (!email || !name || !password) {
    return Promise.reject({ response: 'Unable to register', error: 'Incorrect Form Submission'});
  }
  const hash = bcrypt.hashSync(password);
  try {
    const result = await db.transaction(async (trx) => {
      try {
        const loginEmail = await trx.insert({
          hash: hash,
          email: email,
        }).into('login').returning('email');

        const user = await trx('users').returning('*').insert({
          email: loginEmail[0],
          name,
          joined: new Date(),
        });

        trx.commit;
        return { response: 'Success', user: user[0] };
      } catch (error) {
        trx.rollback;
        return Promise.reject({ response: 'Unable to register', error: `${error.detail} (Table - ${error.table})` });
      }
    })

    return (result)
  } catch (error) {
    return Promise.reject(error);
  }
}

const createSessions = async (user) => {
  try {
    const { email, id } = user;
    const token = sessionFunctions.signToken(email);
    await sessionFunctions.setToken(token, id)
    return { success: 'true', userId: id, token }
  } catch (error) {
    console.log
  }
};

const registerAuthentication = (db, bcrypt) => async (req, res) => {
  const { email, name, password } = req.body;
  const details = { email, name, password }

  try {
    const data = await handleRegister(db, bcrypt, details);
    
    const session = await createSessions(data.user);

    const response = {
      data,
      session
    }

    return await res.status(200).json(response)
  } catch (error) {
    return await res.status(400).json(error);
  }
  
}



module.exports = {
  registerAuthentication
};
