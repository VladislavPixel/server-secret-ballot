const { Schema } = require('mongoose');

const types = Schema.Types;

const options = {
	_id: types.String,
	name: types.String,
	description: types.String,
	dateCreated: types.Number,
	dateEvent: types.Number,
	numberOfVotes: types.Number,
	isFinished: types.Boolean,
	accepted: types.Number,
	denied: types.Number,
	votingUsers: [ types.String ]
};

const schemaEvent = new Schema(options);

module.exports = schemaEvent;
