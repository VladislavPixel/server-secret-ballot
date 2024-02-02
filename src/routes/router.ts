const express = require('express');

const routerChild = express.Router({ mergeParams: true });

// без проверки авторизации
routerChild.use('/auth', require('./auth.routes'));

// с проверкой авторизации
routerChild.use('/events', require('./events.routes'));
routerChild.use('/voices', require('./voices.routes'));
routerChild.use('/accounts', require('./accounts.routes'));

module.exports = routerChild;