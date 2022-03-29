const getAllUsers = async (req, res, db) => {
  try {
    const response = await db.select('*').from('users');
    return await res.status(200).json(response);
  } catch (error) {
    return await res.status(400).json({ ...error });
  }
};

const deleteUser = async (req, res, db) => {
  const { id } = req.params;
  try {
    const [user] = await db.select('*').from('users').where({ id });

    if (!user) throw new Error('User Not Found');

    const result = await db.transaction(async (trx) => {
      try {
        await trx('users').where({ id }).del();
        await trx('login').where('email', user.email).del();

        trx.commit;
        return await res
          .status(200)
          .json({ response: 'Success', message: 'User deleted successfully' });
      } catch (error) {
        trx.rollback;
        return Promise.reject({
          response: 'Unable to delete user',
          error: `${error.message}`
        });
      }
    });

    return result;
  } catch (error) {
    return res.status(400).json({ response: 'Failure', message: error.message });
  }
};

module.exports = {
  getAllUsers,
  deleteUser
};
