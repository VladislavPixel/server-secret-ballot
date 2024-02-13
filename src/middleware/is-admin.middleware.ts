import type { IPayloadUnauthorized, IAccessTokenService, IPayloadAccountNotFound } from '../types';
const payloadUnauthorized: IPayloadUnauthorized = require('../cores/payload-unauthorized');
const instanceAccessTokenService: IAccessTokenService = require('../services/access-token.service');
const chalk = require('chalk');
const accountModel = require('../models/account');
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cores/payload-account-not-found');

const handlerError = (res: any, err: any): void => {
	console.log(chalk.red.inverse('Error is-admin middleware.'));

	console.log(`Error is-admin.`, err);

	res.status(401).send(payloadUnauthorized);
};

function isAdminMiddlewareFn(req: any, res: any, next: any) {
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

		accountModel.findOne({ _id })
			.then((currentUser: any): void => {
				if (!currentUser) {
					return res.status(404).send(payloadAccountNotFound);
				}

				req.userRoleInfo = currentUser.role;

				req.userData = data;

				if (req.userRoleInfo !== 'admin') {
					return res.status(401).send(payloadUnauthorized);
				}

				next();
			})
			.catch((err: any): void => {
				handlerError(res, err);
			});

	} catch (err) {
		handlerError(res, err);
	}
};

module.exports = isAdminMiddlewareFn;
