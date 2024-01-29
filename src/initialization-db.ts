const mongoose = require('mongoose');
const accountsMockData = require('./mock-data/accounts');
const eventsMockData = require('./mock-data/events');
const voicesMockData = require('./mock-data/voices');
const accountModel = require('./models/account');
const eventModel = require('./models/event');
const voiceModel = require('./models/voice');

async function initializationDB(mode: string) {
	switch(mode) {
		case 'production':
			console.log(`Your application launch mod - ${mode}. In production, the database is not initialized with data, but simply cleared.`);
		break;
		case 'development':
			const collectionName = accountModel.collection.collectionName; // имя конкретной коллекции

			const accountsListDoc = await accountModel.find(); // проверяем сколько записанных документов этой коллекции уже имеется в базе

			if (accountsListDoc.length < accountsMockData.length) { // если в базе данных менше чем в моке, значит надо записать моками
				writeToDb(accountModel.collection.collectionName);
			}

			// ДОПИСАТЬ

			let arr = [];
			console.log(collectionName, "NAME", mongoose.connection.dropCollection);

			for(let m = 0; m < accountsMockData.length; m++) {
				const element = { ...accountsMockData[m] };

				delete element._id;

				const doc = new accountModel(element);
				arr.push(doc.save());
			}
			await Promise.all(arr);
		break;
		default:
			console.log(`Your application launch mod - ${mode}. No work has been started.`);
		break;
	}
};

async function writeToDb(nameCollection: string) {
	await mongoose.connection.dropCollection(nameCollection);
};

module.exports = initializationDB;
