const express = require('express');
const authMiddlewareFn = require('../middleware/auth.middleware');

const routerChild = express.Router({ mergeParams: true });

routerChild.use(authMiddlewareFn); // все запросы на роутер идут через это мидлваре, т.к. проверка на авторизацию должна быть у всех

routerChild.use('/events', require('./events.routes'));
routerChild.use('/voices', require('./voices.routes'));
routerChild.use('/accounts', require('./accounts.routes'));

module.exports = routerChild;