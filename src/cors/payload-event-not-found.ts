import type { IPayloadEventNotFound } from '../types';

const payloadEventNotFound: IPayloadEventNotFound = {
	error: {
		message: 'NOT_FOUND_EVENT',
		code: 404
	}
};

module.exports = payloadEventNotFound;
