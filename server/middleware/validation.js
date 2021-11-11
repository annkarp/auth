const isEmail = require('validator').isEmail;
const jwt = require('jsonwebtoken');
const pool = require('../db_pool');

module.exports.signupValidation = async (req, res, next) => {
  try {
    const { username, email, password, role } = req.body;
    const errors = { email: "", password: "", username: "", role: "", error: false };

    const data = await pool.query('SELECT email FROM users WHERE email = $1',
        [email]);

    if (data.rows.length > 0) {
      errors.email = "user email already exist";
      res.status(400).json({ errors });
      return;
    }

    if (username.length < 4) {
      errors.username = "username should be at least 4 characters";
      errors.error = true;
    }

    if (password.length < 6) {
      errors.password = "password should be at least 6 characters";
      errors.error = true;
    }

    if (!isEmail(email)) {
      errors.email = "email isn't valid";
      errors.error = true;
    }

    if (!(role === 'admin'|| 'worker' || 'manager' || 'accountant')) {
      errors.role = "role isn't valid";
      errors.error = true;
    }

    if (errors.error) {
      res.status(400).json({ errors });
    } else {
      next();
    }

  } catch (error) {
    res.status(400).send('not valid credentials');
    console.log(error.message);
  }
}

module.exports.loginValidation = async (req, res, next) => {
  try {
    const { email } = req.body;
    const errors = { email: "" };

    const data = await pool.query('SELECT email FROM users WHERE email = $1',
      [email]);

    if (data.rows.length === 0) {
      errors.email = "email doesn't exist";
      res.status(400).json({ errors });
    } else {
      next();
    }

  } catch (err) {
    console.log(err.message);
  }
};

module.exports.tokenValidation = async (req, res, next) => {
  try {
    const token = req.header('authorization').split("Bearer ")[1]
    const errors = { token: "" };

    if (token) {
      jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
        if (err) {
          errors.token = "token isn't valid";
          res.status(400).json({ errors });
        } else {
          const data = await pool.query(
            'SELECT username FROM users WHERE public_id =$1',
            [decodedToken.public_id]);

          if (data.rows[0].username) {
            next();
          }
        }
      })
    } else {
      errors.token = "user doesn't exist";
      res.status(400).json({ errors });
    }

  } catch (err) {
    console.log(err.message);
  }
};
