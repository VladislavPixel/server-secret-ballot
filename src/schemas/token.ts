const { Schema } = require('mongoose');

const types = Schema.Types;

const options = {
	userId: {
		type: types.ObjectId,
		ref: 'Account',
		required: true
	},
	refreshToken: {
		type: String,
		required: true
	}
};

const schemaToken = new Schema(options, { _id: true, timestamps: true });

module.exports = schemaToken;
