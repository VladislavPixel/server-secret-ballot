import type { IPayloadUnauthorized, IAccessTokenService } from '../types';
const payloadUnauthorized: IPayloadUnauthorized = require('../cores/payload-unauthorized');
const instanceAccessTokenService: IAccessTokenService = require('../services/access-token.service');
const chalk = require('chalk');

function authMiddlewareFn(req: any, res: any, next: any) {
	console.log('Middleware auth is working!!! authMiddlewareFn');

	if (req.method === 'OPTIONS') {
		return next();
	}

	try {
		const valueAuthorization: string | undefined = req.headers.authorization;

		if (!valueAuthorization) {
			return res.status(401).send(payloadUnauthorized);
		}

		const token: string | undefined = valueAuthorization.split(' ')[1];

		if (!token) {
			return res.status(401).send(payloadUnauthorized);
		}

		// валидирует токен, вытаскивает полезную нагрузку и добавляет ее к обьъекту запроса по пайплайну
		const data = instanceAccessTokenService.validateAccessToken(token);

		req.userData = data;

		next();

	} catch (err) {
		req.userData = null;

		console.log(chalk.red.inverse('Error when decoding the token. authMiddlewareFn.'));

		console.log(`Error decoding token. authMiddlewareFn.`, err);

		res.status(401).send(payloadUnauthorized);
	}
};

module.exports = authMiddlewareFn;
