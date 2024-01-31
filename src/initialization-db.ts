const chalk = require('chalk');
const mongoose = require('mongoose');
const accountsMockData = require('./mock-data/accounts');
const eventsMockData = require('./mock-data/events');
const voicesMockData = require('./mock-data/voices');
const accountModel = require('./models/account');
const eventModel = require('./models/event');
const voiceModel = require('./models/voice');

async function initializationDB(mode: string) {
	try {
		switch(mode) {
			case 'production':
				console.log(`Your application launch mod - ${mode}. In production, the database is not initialized with data.`);
			break;
			case 'development':
				const accountsCollectionName = accountModel.collection.collectionName; // имя конкретной коллекции

				const accountsListDoc = await accountModel.find(); // проверяем сколько записанных документов этой коллекции уже имеется в базе

				if (accountsListDoc.length < accountsMockData.length) { // если в базе данных менше чем в моке, значит надо записать моками
					writeToDb(accountsCollectionName, accountsMockData, accountModel);
				}

				const eventsCollectionName = eventModel.collection.collectionName;

				const eventsListDoc = await eventModel.find();

				if (eventsListDoc.length < eventsMockData.length) {
					writeToDb(eventsCollectionName, eventsMockData, eventModel);
				}

				const voicesCollectionName = voiceModel.collection.collectionName;

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

async function writeToDb(nameCollection: string, mockData: any, model: any): Promise<any> {
	try {
		await mongoose.connection.dropCollection(nameCollection); // полностью очищаем коллекцию

		let arr = [];

		for(let m = 0; m < mockData.length; m++) {
			const element = { ...mockData[m] };

			delete element._id;

			const doc = new model(element); // создаем документ монги на модель

			arr.push(doc.save()); // сохраняем документ
		};

		await Promise.all(arr); // обрабатываем все промисы сохранения документов
	} catch (err) {
		console.log(chalk.red.inverse(`There is an error in the database record function. Name Collection - ${nameCollection}.`));

		throw new Error('error writeToDb fn.');
	}
};

module.exports = initializationDB;
