const Router = require('express').Router;
const usersController = require('../controllers/users');
const validation = require('../middleware/validation');
const usersRoute = Router();

usersRoute.get('/', validation.tokenValidation,  usersController.getAllUsers);

module.exports = usersRoute;
