const { model } = require('mongoose');
const schemaEvent = require('../schemas/event');

module.exports = model('Event', schemaEvent);
