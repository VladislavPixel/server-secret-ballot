const config = require('config');
const jwt = require('jsonwebtoken');

class AccessTokenService {
	expiresInValue: number;

	constructor(expiresIn: number) {
		this.expiresInValue = expiresIn;
	}

	generateToken(controlData: any) { // строка в которой идет ключ/значение через пробел
		const accessToken = jwt.sign(controlData, config.get('accessTokenSecret'), { expiresIn: this.expiresInValue });

		const refreshToken = jwt.sign(controlData, config.get('refreshTokenSecret'), { expiresIn: '2 days' });

		return ({
			accessToken,
			refreshToken,
			expiresIn: this.expiresInValue * 1000 // на клиент будет передано количество миллисекунд для одного часа, чтобы было удобно с этим работать
		});
	}

	validateAccessToken() {
		
	}
};

module.exports = new AccessTokenService(3600); // Token будет действовать на час, передается количество секунд в одном часе
