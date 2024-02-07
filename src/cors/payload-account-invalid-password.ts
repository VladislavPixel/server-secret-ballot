import type { IPayloadAccountInvalidPassword } from '../types';

const payloadAccountInvalidPassword: IPayloadAccountInvalidPassword = {
	error: {
		message: 'INVALID_PASSWORD_ACCOUNT',
		code: 400
	}
};

module.exports = payloadAccountInvalidPassword;