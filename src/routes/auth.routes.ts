import { IPayloadAccountNotFound } from '../types';
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cors/payload-account-not-found');
const chalk = require('chalk');
const express = require('express');
const accountModel = require('../models/account');
const bcrypt = require('bcryptjs');

const routerAuth = express.Router({ mergeParams: true });

routerAuth.get('/signIn', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { login, password } = req.body

		const accountData = await accountModel.findOne({ login, password });

		if (!accountData) {
			return res.status(400).send(payloadAccountNotFound)
		}

		const isPasswordEqual = await bcrypt.compare(password, accountData.password);

		res.status(200).send(accountData);
	} catch(err) {
		console.log(chalk.red.inverse('Error sign-in.'));

		console.log(`Error: ${err}.`);

		res.status(400).send([]);
	}
});

module.exports = routerAuth;