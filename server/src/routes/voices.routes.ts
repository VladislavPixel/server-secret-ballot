import type { IPayloadVoiceInvalidParams, IPayloadEventNotFound, IPayloadEventIsFinished, IPayloadUnauthorized, IPayloadAccountNotFound } from '../types';
const express = require('express');
const voicesModel = require('../models/voice');
const eventModel = require('../models/event');
const accountModel = require('../models/account');
const chalk = require('chalk');
const payloadVoiceInvalidParams: IPayloadVoiceInvalidParams = require('../cores/payload-voice-invalid-params');
const payloadEventNotFound: IPayloadEventNotFound = require('../cores/payload-event-not-found');
const payloadEventIsFinished: IPayloadEventIsFinished = require('../cores/payload-event-is-finished');
const payloadUnauthorized: IPayloadUnauthorized = require('../cores/payload-unauthorized');
const payloadAccountNotFound: IPayloadAccountNotFound = require('../cores/payload-account-not-found');

const routerVoices = express.Router({ mergeParams: true });

routerVoices.post('/voice/create', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const voiceBody = req.body;

		if (!voiceBody) {
			return res.status(400).send(payloadVoiceInvalidParams);
		}

		const searchEvent = await eventModel.findOne({ _id: voiceBody.idEvent });

		if (!searchEvent) {
			return res.status(404).send(payloadEventNotFound);
		}

		const currentNumberVotes: number = searchEvent.accepted + searchEvent.denied;

		// если статус эвента завершенный, то голосование уже невозможно
		if (searchEvent.isFinished || (searchEvent.numberOfVotes === currentNumberVotes)) {
			return res.status(400).send(payloadEventIsFinished);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		if (currentUser && currentUser.role === 'admin') {
			return res.status(401).send(payloadUnauthorized);
		}

		const voiceD = await voicesModel.create(voiceBody);

		searchEvent.accepted = voiceBody.accepted ? searchEvent.accepted + 1 : searchEvent.accepted;

		searchEvent.denied = voiceBody.denied ? searchEvent.denied + 1 : searchEvent.denied;

		searchEvent.isFinished = searchEvent.accepted + searchEvent.denied === searchEvent.numberOfVotes ? true : false;

		await searchEvent.save();

		res.status(201).send({
			voice: voiceD,
			event: searchEvent
		});

	} catch(err) {
		console.log(chalk.red.inverse('Error create voice in bd.'));

		console.log(`Error: ${err}.`);

		res.status(500).send({});
	}
});

routerVoices.post('/voice/:id', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const { id } = req.params; // передается Id event

		if (!id) {
			return res.status(400).send(payloadVoiceInvalidParams);
		}

		const { _id } = req.userData;

		const currentUser = await accountModel.findOne({ _id });

		if (!currentUser) {
			return res.status(404).send(payloadAccountNotFound);
		}

		const requestBody = req.body;

		if (Object.prototype.hasOwnProperty.call(requestBody, 'userId')) {
			const voiceTarget = await voicesModel.findOne({ idEvent: id, userId: requestBody.userId }); // двойной фильтр

			return res.status(200).send([voiceTarget]);
		}

		const voicesResult = await voicesModel.find({ idEvent: id });

		return res.status(200).send(voicesResult);
	} catch(err) {
		console.log(chalk.red.inverse('Error get() operation by id.'));

		console.log(`Error: ${err}.`);

		res.status(500).send([]);
	}
});

module.exports = routerVoices;
