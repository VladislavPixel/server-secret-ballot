import type { IPayloadAccountNotFound, IPayloadAccountInvalidPassword, IAccessTokenService } from '../types';
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cors/payload-account-not-found');
const payloadAccountInvalidPassword: IPayloadAccountInvalidPassword = require('../cors/payload-account-invalid-password');
const chalk = require('chalk');
const express = require('express');
const accountModel = require('../models/account');
const bcrypt = require('bcryptjs');
const accessTokenService: IAccessTokenService = require('../services/access-token.service');

const routerAuth = express.Router({ mergeParams: true });

routerAuth.post('/signIn', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { login, password } = req.body;

		// пытаемся найти в базе с таким логином учетную запись
		const accountData = await accountModel.findOne({ login });

		if (!accountData) {
			return res.status(400).send(payloadAccountNotFound);
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
			userId: accountData._id
		});

	} catch(err) {
		console.log(chalk.red.inverse('Error sign-in.'));

		console.log(`Error: ${err}.`);

		res.status(400).send({});
	}
});

module.exports = routerAuth;
