import type { IPayloadAccountInvalidParams, IPayloadAccountNotFound, IPayloadUnauthorized, IPayloadAccountInvalidPayloadRequest } from '../types';
const express = require('express');
const accountModel = require('../models/account');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const config = require('config');
const payloadAccountInvalidParams: IPayloadAccountInvalidParams = require('../cors/payload-account-invalid-params');
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cors/payload-account-not-found');
const payloadUnauthorized: IPayloadUnauthorized = require('../cors/payload-unauthorized');
const payloadAccountInvalidPayloadReq: IPayloadAccountInvalidPayloadRequest = require('../cors/payload-account-invalid-payload-req');
const payloadAccountNotDeleteAdmin = require('../cors/payload-account-not-delete-admin');

const routerAccounts = express.Router({ mergeParams: true });

routerAccounts.get('/', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const accountsData = await accountModel.find();

		res.status(200).send(accountsData);

	} catch(err) {
		console.log(chalk.red.inverse('Error receiving accounts.'));

		console.log(`Error: ${err}.`);

		res.status(500).send([]);
	}
});

routerAccounts.post('/account/create', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { login, password } = req.body;

		if (!login || !password) {
			return res.status(400).send(payloadAccountInvalidPayloadReq);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		if (currentUser.role !== 'admin') {
			return res.status(401).send(payloadUnauthorized);
		}

		const hashNewPassword: string = await bcrypt.hash(password, config.get('saltRounds'));

		const newAccountData = await accountModel.create({ login, password: hashNewPassword, role: 'user' });

		res.status(201).send(newAccountData);

	} catch(err) {
		console.log(chalk.red.inverse('Error create account.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

routerAccounts.delete('/account/delete/:id', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		// ДОДЕЛАТЬ НЕ РАБОТАЕТ
		const { id } = req.params;

		if (!id) {
			return res.status(400).send(payloadAccountInvalidParams);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		console.log(currentUser, "CURRENT USER");

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		if (currentUser.role !== 'admin') {
			return res.status(401).send(payloadUnauthorized);
		}

		if (_id === id) {
			return res.status(400).send(payloadAccountNotDeleteAdmin);//=================
		}

		const existingAccount = await accountModel.findOne({ _id: id });

		if (!existingAccount) {
			return res.status(404).send(payloadAccountNotFound);
		}

		await accountModel.deleteOne({ _id: id });

		res.status(200).send(existingAccount);
	} catch(err) {
		console.log(chalk.red.inverse('Error delete account.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

module.exports = routerAccounts;
