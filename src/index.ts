const express = require('express');
const dotenv = require('dotenv');
const chalk = require('chalk');

dotenv.config();

const APP: typeof express.Express = express();

const PORT: string = process.env.PORT || '3000';

const MODE = process.env.NODE_ENV;

if (MODE && MODE === 'production') {
	console.log(chalk.green.inverse('Server is running in production mode.'));
	/**
	 * код для отдачи статики
	 */
} else {
	console.log(chalk.red.inverse('Server is running in development mode.'));
}

APP.get('/', function(request: typeof express.Request, response: typeof express.Response) {
	response.send('Express-nodeJS with TypeScript server.');
});

APP.listen(PORT, function() {
	console.log(`Server is running at http://localhost:${PORT}. His mode: ${MODE}.`);
});
