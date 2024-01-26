const express = require('express');

const routerChild = express.Router({ mergeParams: true });

routerChild.use('/events', require('./events.routes'));

module.exports = routerChild;