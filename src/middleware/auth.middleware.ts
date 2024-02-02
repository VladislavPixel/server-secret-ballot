import { IPayloadUnauthorized } from '../types';
const payloadUnauthorized: IPayloadUnauthorized = require('../cors/payload-unauthorized');
const instanceAccessTokenService = require('../services/access-token.service');

function authMiddlewareFn(req: any, res: any, next: any) {
	const valueAuthorization = req.headers.authorization;

	if (!valueAuthorization) {
		return res.status(401).send(payloadUnauthorized);
	}

	const token = valueAuthorization.split(' ')[1];

	if (!token) {
		return res.status(401).send(payloadUnauthorized);
	}

	const v = instanceAccessTokenService.generateToken({ login: "viva8123", password: "vbn213" });

	console.log(v, 'GENERATE TOKEN');
	console.log(req.body, "REQ MIDDLEWARE");

	next();
};

module.exports = authMiddlewareFn;
