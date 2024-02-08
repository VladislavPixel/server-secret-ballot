import type { IPayloadNotDeleteAdminAccount } from '../types';

const payloadAccountNotDeleteAdmin: IPayloadNotDeleteAdminAccount = {
	error: {
		message: 'NOT_DELETE-ADMIN_ACCOUNT',
		code: 400
	}
};

module.exports = payloadAccountNotDeleteAdmin;
