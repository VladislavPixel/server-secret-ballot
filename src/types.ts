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

export interface IAccount {
	_id?: string | undefined;
	login: string;
	password: string;
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

export interface IResultGenerateToken {

};

export interface IAccessTokenService {
	expiresInValue: number;
};
