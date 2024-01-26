const express = require('express');
const chalk = require('chalk');

const routerEvents = express.Router({ mergeParams: true });

routerEvents.get('/', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		
	} catch(err) {
		console.log(chalk.red.inverse('Error receiving events.'));

		console.log(`Error: ${err}.`);

		res.status(400).send([]);
	}
});

module.exports = routerEvents;
