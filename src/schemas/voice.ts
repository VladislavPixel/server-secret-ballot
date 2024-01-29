const { Schema } = require('mongoose');

const types = Schema.Types;

const options = {
	idEvent: types.String,
	userId: types.String,
	accepted: types.Boolean,
	denied: types.Boolean
};

const schemaVoice = new Schema(options, { _id: true });

module.exports = schemaVoice;
