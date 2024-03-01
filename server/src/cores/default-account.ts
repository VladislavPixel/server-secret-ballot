import type { IAccount } from '../types';

const defaultAccount: IAccount = {
	login: 'super-star777',
	password: '$2a$12$m0mDBcp9DiJF7CQZsEa9wezHFvaoFzovGbQokP59MQsqfUIc0nIRK',
	role: 'user',
	fullName: 'Подставились дефолтные данные',
	isMemberOfTheCountingCommission: false
};

module.exports = defaultAccount;
