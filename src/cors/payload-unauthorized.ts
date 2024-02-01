import { IPayloadUnauthorized } from '../types';

const payloadUnauthorized: IPayloadUnauthorized = {
	error: {
		message: "Unauthorized",
		code: 401
	}
};

module.exports = payloadUnauthorized;
