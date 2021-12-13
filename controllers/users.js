const getAllUsers = async (req, res, db) => {
  try {
    const response = await db.select('*').from('users');
    return await res.status(200).json(response);
  } catch (error) {
    console.log(error);
    return await res.status(400).json({ ...error });
  }
}

module.exports = {
  getAllUsers
}