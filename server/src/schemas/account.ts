const { Schema } = require('mongoose');

const types = Schema.Types;

const options = {
	login: types.String,
	password: types.String,
	role: types.String,
	fullName: types.String,
	isMemberOfTheCountingCommission: types.Boolean
};

const schemaAccount = new Schema(options, { _id: true });

module.exports = schemaAccount;
