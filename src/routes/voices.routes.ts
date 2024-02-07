import type { IEvent, IVoice, IPayloadVoiceInvalidParams, IPayloadEventNotFound } from '../types';
const express = require('express');
const voicesModel = require('../models/voice');
const eventModel = require('../models/event');
const chalk = require('chalk');
const payloadVoiceInvalidParams: IPayloadVoiceInvalidParams = require('../cors/payload-voice-invalid-params');
const payloadEventNotFound: IPayloadEventNotFound = require('../cors/payload-event-not-found');

const routerVoices = express.Router({ mergeParams: true });

//routerVoices.get('/', async (req: typeof express.Request, res: typeof express.Response) => {
//	try {
//		const voicesData = await voicesModel.find();

//		res.status(200).send(voicesData);

//	} catch(err) {
//		console.log(chalk.red.inverse('Error receiving voices.'));

//		console.log(`Error: ${err}.`);

//		res.status(400).send([]);
//	}
//});

routerVoices.post('/voice-create', async (req: typeof express.Request, res: typeof express.Response) => {
	try {
		const voiceBody: IVoice | undefined = req.body;

		if (!voiceBody) {
			return res.status(400).send(payloadVoiceInvalidParams);
		}

		const searchEvent: IEvent = await eventModel.findOne({ _id: voiceBody.idEvent });

		if (!searchEvent) {
			return res.status(400).send(payloadEventNotFound);
		}

		if (searchEvent.isFinished) {
			return
		}
		// ПРОВЕРИТЬ ВСЕ ЛИ СХОДИТСЯ, возможно ли голосование или уже можно закрывать

		const voiceD = await voicesModel.create(voiceBody);

		await eventModel.

		res.status(201).send(voiceD);

	} catch(err) {
		console.log(chalk.red.inverse('Error create voice in bd.'));

		console.log(`Error: ${err}.`);

		res.status(400).send({});
	}
});

module.exports = routerVoices;
