import { IPayloadAccountNotFound } from '../types';

const payloadAccountNotFound: IPayloadAccountNotFound = {
	error: {
		message: "ACCOUNT_NOT_FOUND",
		code: 400
	}
};

module.exports = payloadAccountNotFound;