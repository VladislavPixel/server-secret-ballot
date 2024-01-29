const { model } = require('mongoose');
const schemaAccount = require('../schemas/account');

module.exports = model('Account', schemaAccount);
