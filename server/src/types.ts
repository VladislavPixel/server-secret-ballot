export interface IPayloadUnauthorized {
	error: {
		message: 'Unauthorized';
		code: 401;
	}
};

export interface IPayloadNotDeleteAdminAccount {
	error: {
		message: 'NOT_DELETE-ADMIN_ACCOUNT',
		code: 400
	}
};

export interface IPayloadAccountInvalidParams {
	error: {
		message: 'INVALID_PARAMS_ACCOUNT',
		code: 400
	}
};

export interface IPayloadAccountInvalidPayloadRequest {
	error: {
		message: 'INVALID_PAYLOAD-REQUEST_ACCOUNT',
		code: 400
	}
}

export interface IPayloadAccountNotFound {
	error: {
		message: 'NOT_FOUND_ACCOUNT';
		code: 404;
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
		message: 'INVALID_PARAMS_EVENT',
		code: 400
	}
};

export interface IPayloadEventInvalidPayloadRequest {
	error: {
		message: 'INVALID_PAYLOAD-REQUEST_EVENT',
		code: 400
	}
};

export interface IPayloadVoiceInvalidParams {
	error: {
		message: 'INVALID_PARAMS_VOICE',
		code: 400
	}
};

export interface IPayloadEventNotFound {
	error: {
		message: 'NOT_FOUND_EVENT',
		code: 404
	}
};

export interface IPayloadEventIsFinished {
	error: {
		message: 'IS_FINISHED_EVENT',
		code: 400
	}
};

export interface IAccount {
	_id?: string | undefined;
	login: string;
	password: string;
	role: string;
	fullName: string;
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

export interface IResultValidateToken {
	_id: string;
	iat: number;
	exp: number;
};

export interface IAccessTokenService {
	expiresInValue: number;
	generateToken(controlData: IDataProp): IResultGenerateToken;
	saveRefreshToken(tokenR: string, accountId: string): Promise<string>;
	validateAccessToken(token: string): IResultValidateToken;
	validateRefresh(refreshToken: string): IResultValidateToken;
	findRefreshInCollection(refreshToken: string): Promise<any>;
};
