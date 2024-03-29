const Router = require('express').Router;
const authController = require('../controllers/auth');
const validation = require('../middleware/validation');
const authRoute = Router();

authRoute.post('/signup', validation.signupValidation, authController.signup);
authRoute.post('/login', validation.loginValidation, authController.login);

module.exports = authRoute;
