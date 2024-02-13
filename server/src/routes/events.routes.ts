import type { IPayloadEventInvalidParams, IPayloadEventNotFound, IPayloadEventInvalidPayloadRequest, IPayloadAccountNotFound, IPayloadUnauthorized, IEvent } from '../types';
const express = require('express');
const chalk = require('chalk');
const eventModel = require('../models/event');
const payloadEventInvalidParams: IPayloadEventInvalidParams = require('../cores/payload-event-invalid-params');
const payloadEventNotFound: IPayloadEventNotFound = require('../cores/payload-event-not-found');
const payloadEventInvalidPayloadRequest: IPayloadEventInvalidPayloadRequest = require('../cores/payload-event-invalid-payload-req');
const accountModel = require('../models/account');
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cores/payload-account-not-found');
const payloadUnauthorized: IPayloadUnauthorized = require('../cores/payload-unauthorized');
const defaultEvent: IEvent = require('../cores/default-event');
const isAdminMiddlewareFn = require('../middleware/is-admin.middleware');

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

routerEvents.post('/event/create', isAdminMiddlewareFn, async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		let requestBody = req.body;

		if (!requestBody || !(typeof requestBody === 'object')) {
			return res.status(400).send(payloadEventInvalidPayloadRequest);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		if (currentUser.role !== 'admin') {
			return res.status(401).send(payloadUnauthorized);
		}

		requestBody = {
			...defaultEvent,
			...requestBody
		};

		const newEvent = await eventModel.create(requestBody);

		res.status(201).send(newEvent);
	} catch(err) {
		console.log(chalk.red.inverse('Event create error.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

routerEvents.delete('/event/delete/:id', isAdminMiddlewareFn, async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).send(payloadEventInvalidParams);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		if (currentUser.role !== 'admin') {
			return res.status(401).send(payloadUnauthorized);
		}

		const searchEventById = await eventModel.findOne({ _id: id });

		if (!searchEventById) {
			return res.status(404).send(payloadEventNotFound);
		}

		await eventModel.deleteOne({ _id: id });

		res.status(200).send(searchEventById);
	} catch(err) {
		console.log(chalk.red.inverse('Event delete by id error.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

routerEvents.post('/event/update/:id', isAdminMiddlewareFn, async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { id } = req.params;

		let requestBody = req.body;

		if (!id) {
			return res.status(400).send(payloadEventInvalidParams);
		}

		if (!requestBody || !(typeof requestBody === 'object')) {
			return res.status(400).send(payloadEventInvalidPayloadRequest);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		if (currentUser.role !== 'admin') {
			return res.status(401).send(payloadUnauthorized);
		}

		const updatedEvent = await eventModel.findOneAndUpdate({ _id: id }, requestBody, { returnDocument: 'after', new: true });

		res.status(200).send(updatedEvent);
	} catch(err) {
		console.log(chalk.red.inverse('Event update by id error.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

module.exports = routerEvents;
