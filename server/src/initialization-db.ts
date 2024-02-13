import type { IAccount, IEvent, IVoice } from './types';
const chalk = require('chalk');
const mongoose = require('mongoose');
const accountsMockData = require('./mock-data/accounts');
const eventsMockData = require('./mock-data/events');
const voicesMockData = require('./mock-data/voices');
const accountModel = require('./models/account');
const eventModel = require('./models/event');
const voiceModel = require('./models/voice');

async function initializationDB(mode: string): Promise<void> {
	try {
		const accountsCollectionName = accountModel.collection.collectionName; // имя конкретной коллекции

		const eventsCollectionName = eventModel.collection.collectionName;

		const voicesCollectionName = voiceModel.collection.collectionName;

		switch(mode) {
			case 'production':
				// в этом моде мы проводим очистку базы и инициализацию коллекций
				writeToDb(accountsCollectionName, [accountsMockData[accountsMockData.length - 1]], accountModel);
				writeToDb(eventsCollectionName, [], eventModel);
				writeToDb(voicesCollectionName, [], voiceModel);

				console.log(`Your application launch mod - ${mode}. In production, the database is not initialized with data.`);
			break;
			case 'development':
				const accountsListDoc = await accountModel.find(); // проверяем сколько записанных документов этой коллекции уже имеется в базе

				if (accountsListDoc.length < accountsMockData.length) { // если в базе данных менше чем в моке, значит надо записать моками
					writeToDb(accountsCollectionName, accountsMockData, accountModel);
				}

				const eventsListDoc = await eventModel.find();

				if (eventsListDoc.length < eventsMockData.length) {
					writeToDb(eventsCollectionName, eventsMockData, eventModel);
				}

				const voicesListDoc = await voiceModel.find();

				if (voicesListDoc.length < voicesMockData.length) {
					writeToDb(voicesCollectionName, voicesMockData, voiceModel);
				}

				console.log(chalk.green.inverse(`Database initialization was successful. His mode initialization - ${mode}.`));
			break;
			default:
				console.log(`Your application launch mod - ${mode}. No work has been started.`);
			break;
		}

	} catch(err) {
		console.log(`Error:`, err);

		console.log(chalk.red.inverse('An error occurred while initializing the database.'));

		throw new Error('Error: initializationDB fn.');
	}
};

async function writeToDb(nameCollection: string, mockData: IAccount[] | IEvent[] | IVoice[], model: any): Promise<void> {
	try {
		await mongoose.connection.dropCollection(nameCollection); // полностью очищаем коллекцию

		let arr = [];

		if (mockData.length) {
			for(let m = 0; m < mockData.length; m++) {
				const element: IAccount | IEvent | IVoice = { ...mockData[m] };

				delete element._id;

				const doc = new model(element); // создаем документ монги на модель

				arr.push(doc.save()); // сохраняем документ
			};

		} else {
			arr.push(model.createCollection());
		}

		await Promise.all(arr); // обрабатываем все промисы сохранения документов

	} catch (err) {
		console.log(chalk.red.inverse(`There is an error in the database record function. Name Collection - ${nameCollection}.`));

		throw new Error('error writeToDb fn.');
	}
};

module.exports = initializationDB;
