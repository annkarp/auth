const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pool = require('../db_pool');
const sendToKafka = require('../kafka/producer')

const createToken = (id) => {
  return jwt.sign(id, process.env.SECRET);
}

module.exports.login = async (req, res) => {
  try {
    const { password, email } = req.body;

    const data = await pool.query(
      'SELECT public_id, username, role, password FROM users WHERE email = $1',
      [email]
    );

    const user = data.rows[0];
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (isValidPassword) {
      const token = createToken({ public_id: user.public_id, username: user.username, role: user.role });
      res.status(200).json({ token, public_id: user.public_id, username: user.username, role: user.role });
    } else {
      res.status(400).json({ errors: { password: "password is wrong" } })
    }

  } catch (error) {
    console.log(error);
    res.status(400).json(error.message);
  }
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password, role } = req.body;

    const encryptedPassword = await bcrypt.hash(password, 10);

    const signup = await pool.query(
        `INSERT INTO users(username, email, password, role) VALUES($1, $2, $3, $4) RETURNING public_id;`,
      [username, email, encryptedPassword, role]);

    const token = createToken({ public_id: signup.rows[0].public_id, username, role });
    res.status(200).json({ token, public_id: signup.rows[0].public_id, username, role });

    const message = { public_id: signup.rows[0].public_id, username, email, role };
    sendToKafka(message, 'AccountCreated')

  } catch (err) {
    console.log(err);
  }
};
