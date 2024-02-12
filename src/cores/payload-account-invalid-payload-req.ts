import type { IPayloadAccountInvalidPayloadRequest } from '../types';

const payloadAccountInvalidPayloadReq: IPayloadAccountInvalidPayloadRequest = {
	error: {
		message: 'INVALID_PAYLOAD-REQUEST_ACCOUNT',
		code: 400
	}
};

module.exports = payloadAccountInvalidPayloadReq;
