export interface IPayloadUnauthorized {
	error: {
		message: "Unauthorized";
		code: 401;
	}
};

export interface IPayloadAccountNotFound {
	error: {
		message: "ACCOUNT_NOT_FOUND";
		code: 400;
	}
};

export interface IPayloadAccountInvalidPassword {
	error: {
		message: 'INVALID_PASSWORD_ACCOUNT',
		code: 400
	}
};

export interface IPayloadEventInvalidParams {
	error: {
		message: 'EVENT_INVALID_PARAMS',
		code: 400
	}
};

export interface IPayloadVoiceInvalidParams {
	error: {
		message: 'VOICE_INVALID_PARAMS',
		code: 400
	}
};

export interface IPayloadEventNotFound {
	error: {
		message: 'EVENT_NOT_FOUND',
		code: 400
	}
};

export interface IAccount {
	_id?: string | undefined;
	login: string;
	password: string;
	role: string;
};

export interface IEvent {
	_id?: string | undefined;
	name: string;
	description: string;
	dateCreated: number;
	dateEvent: number;
	numberOfVotes: number;
	isFinished: boolean;
	accepted: number;
	denied: number;
	votingUsers: string[];
};

export interface IVoice {
	_id?: string | undefined;
	idEvent: string;
	userId: string;
	accepted: boolean;
	denied: boolean;
};

export interface IDataProp {
	[key: string]: PropertyKey;
};

export interface IResultGenerateToken {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
};

export interface IAccessTokenService {
	expiresInValue: number;
	generateToken(controlData: IDataProp): IResultGenerateToken;
	saveRefreshToken(tokenR: string, accountId: string): Promise<string>;
	validateAccessToken(token: string): any;
};
