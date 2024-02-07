import type { IPayloadEventNotFound } from '../types';

const payloadEventNotFound: IPayloadEventNotFound = {
	error: {
		message: 'EVENT_NOT_FOUND',
		code: 400
	}
};

module.exports = payloadEventNotFound;
