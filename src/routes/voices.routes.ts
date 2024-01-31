const express = require('express');
const voicesModel = require('../models/voice');
const chalk = require('chalk');

const routerVoices = express.Router({ mergeParams: true });

routerVoices.get('/', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const voicesData = await voicesModel.find();

		res.status(200).send(voicesData);
	} catch(err) {
		console.log(chalk.red.inverse('Error receiving voices.'));

		console.log(`Error: ${err}.`);

		res.status(400).send([]);
	}
});

module.exports = routerVoices;
