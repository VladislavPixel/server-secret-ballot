const { model } = require('mongoose');
const schemaVoice = require('../schemas/voice');

module.exports = model('Voice', schemaVoice);
