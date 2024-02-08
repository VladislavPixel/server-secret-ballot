import type { IPayloadAccountNotFound } from '../types';

const payloadAccountNotFound: IPayloadAccountNotFound = {
	error: {
		message: 'NOT_FOUND_ACCOUNT',
		code: 404
	}
};

module.exports = payloadAccountNotFound;
