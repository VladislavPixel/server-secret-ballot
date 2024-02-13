const { model } = require('mongoose');
const schemaToken = require('../schemas/token');

module.exports = model('Token', schemaToken);
