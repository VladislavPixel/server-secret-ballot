import type { IPayloadEventInvalidParams, IPayloadEventNotFound } from '../types';
const express = require('express');
const chalk = require('chalk');
const eventModel = require('../models/event');
const payloadEventInvalidParams: IPayloadEventInvalidParams = require('../cors/payload-event-invalid-params');
const payloadEventNotFound: IPayloadEventNotFound = require('../cors/payload-event-not-found');

const routerEvents = express.Router({ mergeParams: true });

routerEvents.get('/', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const eventsData = await eventModel.find();

		res.status(200).send(eventsData);

	} catch(err) {
		console.log(chalk.red.inverse('Error receiving events.'));

		console.log(`Error: ${err}.`);

		res.status(500).send([]);
	}
});

routerEvents.get('/:id', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send(payloadEventInvalidParams);
		}

		const searchEventById = await eventModel.findOne({ _id: id });

		if (!searchEventById) {
			return res.status(404).send(payloadEventNotFound);
		}

		res.status(200).send(searchEventById);

	} catch(err) {
		console.log(chalk.red.inverse('Event receipt error.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

module.exports = routerEvents;
