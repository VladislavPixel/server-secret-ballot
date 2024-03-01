import type { IEvent } from '../types';

const defaultEvent: IEvent = {
	name: 'Дефолтное имя события',
	description: 'Дефолтное описание события. Если вы создали такой Event, значит что-то вы делаете не так, как от вас требуется. Удалите это событие и создайте новое.',
	dateCreated: 1485388800000,
	dateEvent: 1706271934194,
	numberOfVotes: 0,
	isFinished: true,
	accepted: 0,
	denied: 0,
	votingUsers: [],
	membersOfTheCountingCommission: []
};

module.exports = defaultEvent;
