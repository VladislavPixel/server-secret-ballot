const express = require('express');
const accountModel = require('../models/account');
const chalk = require('chalk');

const routerAccounts = express.Router({ mergeParams: true });

routerAccounts.get('/', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const accountsData = await accountModel.find();

		res.status(200).send(accountsData);
	} catch(err) {
		console.log(chalk.red.inverse('Error receiving accounts.'));

		console.log(`Error: ${err}.`);

		res.status(400).send([]);
	}
});

module.exports = routerAccounts;