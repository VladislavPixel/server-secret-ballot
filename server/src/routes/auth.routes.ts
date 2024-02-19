import type { IPayloadAccountNotFound, IPayloadAccountInvalidPassword, IAccessTokenService, IPayloadUnauthorized } from '../types';
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cores/payload-account-not-found');
const payloadAccountInvalidPassword: IPayloadAccountInvalidPassword = require('../cores/payload-account-invalid-password');
const chalk = require('chalk');
const express = require('express');
const accountModel = require('../models/account');
const bcrypt = require('bcryptjs');
const accessTokenService: IAccessTokenService = require('../services/access-token.service');
const payloadUnauthorized: IPayloadUnauthorized = require('../cores/payload-unauthorized');

const routerAuth = express.Router({ mergeParams: true });

routerAuth.post('/signIn', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { login, password } = req.body;

		// пытаемся найти в базе с таким логином учетную запись
		const accountData = await accountModel.findOne({ login });

		if (!accountData) {
			return res.status(404).send(payloadAccountNotFound);
		}

		// проверяем, совпадает ли присланный пароль с запросом с хешом пароля учетки, которая уже есть в базе
		const isPasswordEqual = await bcrypt.compare(password, accountData.password);

		if (!isPasswordEqual) {
			return res.status(400).send(payloadAccountInvalidPassword);
		}

		// генерируем уникальный токен
		const tokens = accessTokenService.generateToken({ _id: accountData._id });

		// сохраняем рефреш токен для этой учетки в базе данных, чтобы поддерживать авторизацию
		await accessTokenService.saveRefreshToken(tokens.refreshToken, accountData._id);

		res.status(201).send({
			token: tokens,
			userId: accountData._id,
			role: accountData.role
		});

	} catch(err) {
		console.log(chalk.red.inverse('Error sign-in.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

routerAuth.post('/token/renewal', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { refreshToken } = req.body;

		const data = accessTokenService.validateRefresh(refreshToken); // Проверяем все ли нормально с этим рефрешем

		const dbRefresh = await accessTokenService.findRefreshInCollection(refreshToken); // Ищем по такому токену в базе, если авторизация такая была, то он ее найдет

		if (!data || !dbRefresh || (data._id.toString() !== dbRefresh?.userId?.toString())) {
			return res.status(401).send(payloadUnauthorized);
		}

		const tokens = accessTokenService.generateToken({ _id: data._id.toString() });

		await accessTokenService.saveRefreshToken(tokens.refreshToken, data._id.toString());

		res.status(201).send({
			token: tokens,
			userId: data._id.toString()
		});

	} catch(err) {
		console.log(chalk.red.inverse('Server error. Token refresh failed.', err));

		res.status(500).json({
			message: 'Sorry... Try later. Server error.'
		});
	}
});

module.exports = routerAuth;
