import type { IPayloadEventInvalidPayloadRequest } from '../types';

const payloadEventInvalidPayloadRequest: IPayloadEventInvalidPayloadRequest = {
	error: {
		message: 'INVALID_PAYLOAD-REQUEST_EVENT',
		code: 400
	}
};

module.exports = payloadEventInvalidPayloadRequest;
