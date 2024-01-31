const express = require('express');
const chalk = require('chalk');
const eventModel = require('../models/event');

const routerEvents = express.Router({ mergeParams: true });

routerEvents.get('/', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const eventsData = await eventModel.find();

		res.status(200).send(eventsData);
	} catch(err) {
		console.log(chalk.red.inverse('Error receiving events.'));

		console.log(`Error: ${err}.`);

		res.status(400).send([]);
	}
});

module.exports = routerEvents;
