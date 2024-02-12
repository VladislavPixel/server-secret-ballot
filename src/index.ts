const express = require('express');
const dotenv = require('dotenv');
const config = require('config');
const chalk = require('chalk');
const moongose = require('mongoose');
const { exit } = require('node:process');
const routerChild = require('./routes/router');
const initializationDB = require('./initialization-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('node:path');

dotenv.config();

const APP: typeof express.Express = express();

const PORT: string = config.get('portServer') ?
	config.get('portServer') :
	process.env.PORT ?
	process.env.PORT :
	'3000';

const MODE: string | undefined = process.env.NODE_ENV;

const corsOptions ={
	origin: '*',
	credentials: true,
	optionSuccessStatus: 200
};

APP.use(cors(corsOptions)); // для решения проблем с CORS
APP.use(bodyParser.json({ strict: false })); // для добавления body в request
APP.use('/api/v1', routerChild); // экземпляр дочернего роутера начинает подхватывать это начало

if (MODE && MODE === 'production') {
	console.log(chalk.green.inverse('Server is running in production mode.'));

	// Тут цепляется статика клиента

	const pathBaseStatic = path.join(__dirname, 'client');

	APP.use('/', express.static(pathBaseStatic)); // определяем каталог поиска

	const staticHTML = path.join(pathBaseStatic, 'index.html'); // путь до файла бандла клиента

	APP.get('*', (req: any, res: any): void => { // путь статики, на который реагирует express
		res.status(200).sendFile(staticHTML)
	});
} else {
	console.log(chalk.green.inverse('Server is running in development mode.'));
}

async function startWork(): Promise<void> {
	try {
		await moongose.connect(config.get('mongoDbUrl'));

		console.log(chalk.green.inverse('Mongodb has been started...'));

		APP.listen(PORT, function() {
			console.log(chalk.green.inverse(`Server is running at ${config.get('serverUrl')}. His mode: ${MODE}.`));

			initializationDB(MODE);
		});

	} catch(err) {
		console.log('StartWork method error.', err);

		console.log(chalk.red.inverse('Server is not working or DB is not working. Try later...'));

		exit(1);
	}
}

startWork();
