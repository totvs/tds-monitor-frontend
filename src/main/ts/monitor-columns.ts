import { i18n } from './util/i18n';

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
	usernameDisplayed: string;
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

export function columnOrder(): Array<string> {
	const app = document.querySelector('monitor-app');
	let userColumnsConfig = app.config.columnsConfig;
	if (userColumnsConfig) {
		let userColumnsKeys: Array<string> = new Array();
		userColumnsConfig.split(',').map((key: string) => {
			userColumnsKeys.push(key);
		});
		return userColumnsKeys;
	}
	return defaultColumnOrder();
}

export function defaultColumnOrder(): Array<string> {
	return [
		'usernameDisplayed',
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
	];
}

export const columnText: ColumnData = {
	usernameDisplayed: i18n.localize("USER_NAME", "User Name"),
	environment: i18n.localize("ENVIRONMENT", "Environment"),
	computerName: i18n.localize("COMPUTER_NAME", "Computer Name"),
	threadId: i18n.localize("THREAD_ID", "Thread ID"),
	server: i18n.localize("SERVER", "User In Server"),
	mainName: i18n.localize("MAIN_NAME", "Program"),
	loginTime: i18n.localize("LOGIN_TIME", "Connected"),
	elapsedTime: i18n.localize("ELAPSED_TIME", "Elapsed Time"),
	totalInstrCount: i18n.localize("TOTAL_INSTR_COUNT", "Instruc."),
	instrCountPerSec: i18n.localize("INSTR_COUNT_PER_SEC", "Instruc./Sec"),
	remark: i18n.localize("REMARK", "Comments"),
	memUsed: i18n.localize("MEM_USED", "Memory"),
	sid: i18n.localize("SID", "SID"),
	ctreeTaskId: i18n.localize("CTREE_TASK_ID", "RPO"),
	inactiveTime: i18n.localize("INACTIVE_TIME", "Inactive Time"),
	clientType: i18n.localize("CLIENT_TYPE", "Connection Type")
}
