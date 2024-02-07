const { Schema } = require('mongoose');

const types = Schema.Types;

const options = {
	login: types.String,
	password: types.String,
	role: types.String
};

const schemaAccount = new Schema(options, { _id: true });

module.exports = schemaAccount;
