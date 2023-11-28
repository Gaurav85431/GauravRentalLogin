const express = require('express');
const user_routes = express();

const bodyParser = require('body-parser');
user_routes.use(bodyParser.json());
user_routes.use(bodyParser.urlencoded({ extended: true }));

const user_controller = require('../controllers/userControllers');

const auth = require('../middleware/auth');

user_routes.post('/register', user_controller.register_user);

user_routes.post('/login', user_controller.user_login);

user_routes.get('/test', auth, function (req, res) {
  res.status(200).send({ success: true, msg: "Authenticated" })

});

module.exports = user_routes;

