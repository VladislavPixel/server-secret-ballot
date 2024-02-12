import type { IPayloadUnauthorized, IAccessTokenService, IPayloadAccountNotFound } from '../types';
const payloadUnauthorized: IPayloadUnauthorized = require('../cores/payload-unauthorized');
const instanceAccessTokenService: IAccessTokenService = require('../services/access-token.service');
const chalk = require('chalk');
const accountModel = require('../models/account');
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cores/payload-account-not-found');

async function isAdminMiddlewareFn(req: any, res: any, next: any) {
	console.log('Middleware is-admin is working!!! isAdminMiddlewareFn');

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

		const { _id } = data;

		const currentUser = await accountModel.findOne({ _id });

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		req.userRoleInfo = currentUser.role;

		req.userData = data;

		next();

	} catch (err) {
		console.log(chalk.red.inverse('Error is-admin middleware.'));

		console.log(`Error is-admin.`, err);

		res.status(401).send(payloadUnauthorized);
	}
};

module.exports = isAdminMiddlewareFn;
