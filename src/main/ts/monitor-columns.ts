

export enum Columns {
	username = 'username',
	environment = 'environment',
	computerName = 'computerName',
	threadId = 'threadId',
	server = 'server',
	mainName = 'mainName',
	loginTime = 'loginTime',
	elapsedTime = 'elapsedTime',
	totalInstrCount = 'totalInstrCount',
	instrCountPerSec = 'instrCountPerSec',
	remark = 'remark',
	memUsed = 'memUsed',
	sid = 'sid',
	ctreeTaskId = 'ctreeTaskId',
	inactiveTime = 'inactiveTime',
	clientType = 'clientType',
}


export interface ColumnData {
	username: string;
	environment: string;
	computerName: string;
	threadId: string;
	server: string;
	mainName: string;
	loginTime: string;
	elapsedTime: string;
	totalInstrCount: string;
	instrCountPerSec: string;
	remark: string;
	memUsed: string;
	sid: string;
	ctreeTaskId: string;
	inactiveTime: string;
	clientType: string;
}

export type ColumnKey = keyof ColumnData;

export const columnOrder: Array<ColumnKey> = [
	'username',
	'environment',
	'computerName',
	'threadId',
	'server',
	'mainName',
	'loginTime',
	'elapsedTime',
	'totalInstrCount',
	'instrCountPerSec',
	'remark',
	'memUsed',
	'sid',
	'ctreeTaskId',
	'inactiveTime',
	'clientType'
]

export const columnText: ColumnData = {
	username: 'User Name',
	environment: 'Environment',
	computerName: 'Computer Name',
	threadId: 'Thread ID',
	server: 'User In Server',
	mainName: 'Program',
	loginTime: 'Connected',
	elapsedTime: 'Elapsed Time',
	totalInstrCount: 'Instruc.',
	instrCountPerSec: 'Instruc./Sec',
	remark: 'Comments',
	memUsed: 'Memory',
	sid: 'SID',
	ctreeTaskId: 'RPO',
	inactiveTime: 'Inactive Time',
	clientType: 'Connection Type'
}
