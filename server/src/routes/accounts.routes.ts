import type { IPayloadAccountInvalidParams, IPayloadAccountNotFound, IPayloadUnauthorized, IPayloadAccountInvalidPayloadRequest, IAccount } from '../types';
const express = require('express');
const accountModel = require('../models/account');
const chalk = require('chalk');
const bcrypt = require('bcryptjs');
const config = require('config');
const payloadAccountInvalidParams: IPayloadAccountInvalidParams = require('../cores/payload-account-invalid-params');
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cores/payload-account-not-found');
const payloadUnauthorized: IPayloadUnauthorized = require('../cores/payload-unauthorized');
const payloadAccountInvalidPayloadReq: IPayloadAccountInvalidPayloadRequest = require('../cores/payload-account-invalid-payload-req');
const payloadAccountNotDeleteAdmin = require('../cores/payload-account-not-delete-admin');
const defaultAccount: IAccount = require('../cores/default-account');
const isAdminMiddlewareFn = require('../middleware/is-admin.middleware');

const arrKeysConfig: string[] = Object.keys(config);

const isConfig = arrKeysConfig.length > 0;

const routerAccounts = express.Router({ mergeParams: true });

routerAccounts.get('/', isAdminMiddlewareFn, async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const accountsData = await accountModel.find();

		res.status(200).send(accountsData);

	} catch(err) {
		console.log(chalk.red.inverse('Error receiving accounts.'));

		console.log(`Error: ${err}.`);

		res.status(500).send([]);
	}
});

routerAccounts.post('/account/create', isAdminMiddlewareFn, async (req: typeof express.Request, res: typeof express.Response) => {
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

		const hashNewPassword: string = await bcrypt.hash(password, (isConfig ? config.get('saltRounds') : Number(process.env.SALT_ROUNDS)));

		const newAccountData = await accountModel.create({ ...defaultAccount, login, password: hashNewPassword, role: 'user' });

		res.status(201).send(newAccountData);

	} catch(err) {
		console.log(chalk.red.inverse('Error create account.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

routerAccounts.delete('/account/delete/:id', isAdminMiddlewareFn, async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send(payloadAccountInvalidParams);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		if (currentUser.role !== 'admin') {
			return res.status(401).send(payloadUnauthorized);
		}

		if (_id === id) {
			return res.status(400).send(payloadAccountNotDeleteAdmin);
		}

		const existingAccountForDelete = await accountModel.findOne({ _id: id });

		if (!existingAccountForDelete) {
			return res.status(404).send(payloadAccountNotFound);
		}

		await accountModel.deleteOne({ _id: id });

		res.status(200).send(existingAccountForDelete);
	} catch(err) {
		console.log(chalk.red.inverse('Error delete account.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

routerAccounts.post('/account/update/:id', isAdminMiddlewareFn, async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { id } = req.params;

		const requestBody = req.body;

		if (!id) {
			return res.status(400).send(payloadAccountInvalidParams);
		}

		if (!requestBody || !(typeof requestBody === 'object')) {
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

		if (Object.prototype.hasOwnProperty.call(requestBody, 'password')) {
			const hashPassword = await bcrypt.hash(requestBody.password, (isConfig ? config.get('saltRounds') : Number(process.env.SALT_ROUNDS)));

			requestBody.password = hashPassword;
		}

		requestBody.role = requestBody.role === 'admin' ? 'admin' : 'user';

		const updatedAccount = await accountModel.findOneAndUpdate({ _id: id }, requestBody, { returnDocument: 'after', new: true });

		res.status(200).send(updatedAccount);
	} catch(err) {
		console.log(chalk.red.inverse('Error update account.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

module.exports = routerAccounts;
