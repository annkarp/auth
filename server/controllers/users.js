const pool = require("../db_pool");

module.exports.getAllUsers = async (req, res) => {
  try {
    const { role } = req.query

    const data = await pool.query(
      `SELECT users.public_id, users.username, users.role FROM users WHERE role = $1`,
      [role])

    const users = data.rows
    res.status(200).json(users);

  } catch (err) {
    console.log(err);
  }
};
