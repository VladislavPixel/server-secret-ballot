const express = require('express');
const authMiddlewareFn = require('../middleware/auth.middleware');

const routerChild = express.Router({ mergeParams: true });

// без проверки авторизации;
routerChild.use('/auth', require('./auth.routes'));

// с проверкой авторизации;
routerChild.use('/events', authMiddlewareFn, require('./events.routes'));
routerChild.use('/voices', authMiddlewareFn, require('./voices.routes'));
routerChild.use('/accounts', authMiddlewareFn, require('./accounts.routes'));

module.exports = routerChild;
