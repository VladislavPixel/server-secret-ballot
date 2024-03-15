const { Schema } = require('mongoose');

const types = Schema.Types;

const options = {
	name: types.String,
	description: types.String,
	dateCreated: types.Number,
	dateEvent: types.Number,
	numberOfVotes: types.Number,
	isFinished: types.Boolean,
	accepted: types.Number,
	denied: types.Number,
	votingUsers: [ types.String ],
	membersOfTheCountingCommission: [ types.String ],
	fullNameOfTheCandidate: types.String,
	academicDegree: types.String,
	opportunityToVote: types.Boolean
};

const schemaEvent = new Schema(options, { _id: true });

module.exports = schemaEvent;
