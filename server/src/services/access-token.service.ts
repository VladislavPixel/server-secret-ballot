import type { IDataProp, IResultGenerateToken, IAccessTokenService, IResultValidateToken } from '../types';
const config = require('config');
const jwt = require('jsonwebtoken');
const chalk = require('chalk');
const tokenModel = require('../models/token');

class AccessTokenService implements IAccessTokenService {
	expiresInValue: number;

	constructor(expiresIn: number) {
		this.expiresInValue = expiresIn;
	}

	generateToken(controlData: IDataProp): IResultGenerateToken {
		const accessToken = jwt.sign(controlData, config.get('accessTokenSecret'), { expiresIn: this.expiresInValue });

		const refreshToken = jwt.sign(controlData, config.get('refreshTokenSecret'), { expiresIn: '2 days' });

		return ({
			accessToken,
			refreshToken,
			expiresIn: this.expiresInValue * 1000 // на клиент будет передано количество миллисекунд для одного часа, чтобы было удобно с этим работать
		});
	}

	validateAccessToken(token: string): IResultValidateToken {
		try {
			return jwt.verify(token, config.get('accessTokenSecret'));

		} catch (err) {
			console.log(err, 'Error service token. validateAccessToken');

			console.log(chalk.red.inverse('Error validate access token.'));

			throw new Error('Error validate accesss token');
		}
	}

	validateRefresh(refreshToken: string): IResultValidateToken {
		try {
			return jwt.verify(refreshToken, config.get('refreshTokenSecret'));

		} catch (err) {
			console.log(err, 'Error service token. validateRefresh');

			console.log(chalk.red.inverse('Error validate refresh token.'));

			throw new Error('Error validate refresh token');
		}
	}

	async findRefreshInCollection(refreshToken: string) {
		try {
			return await tokenModel.findOne({ refreshToken: refreshToken });
		} catch (err) {
			console.log(err, 'Error search refresh token. findRefreshInCollection');

			console.log(chalk.red.inverse('Error find refresh token db.'));

			throw new Error('Error find refresh token in DB.');
		}
	}

	async saveRefreshToken(tokenR: string, accountId: string): Promise<string> {
		try {
			// функция, которая поддерживает авторизацию; если в базе есть рефреш токен для конкретного юзера, то мы его обновляем; если еще нет (авторизация впервые, то мы создаем инстанс этой авторизации)
			const existingRefreshToken = await tokenModel.findOne({ userId: accountId });

			if (existingRefreshToken) {
				existingRefreshToken.refreshToken = tokenR;

				return existingRefreshToken.save();
			}

			const newRefreshTokenEssence = await tokenModel.create({ userId: accountId, refreshToken: tokenR });

			return newRefreshTokenEssence;

		} catch (err) {
			console.log(`Error saveRefreshToken: ${err}`);

			console.log(chalk.red.inverse('Oops... Something went wrong when saving the refresh token. Try again later.'));

			throw new Error('Error operation save refresh token.');
		}
	}
};

module.exports = new AccessTokenService(3600); // Token будет действовать на час, передается количество секунд в одном часе
