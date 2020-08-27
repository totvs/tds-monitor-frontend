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


export function columnConfig(): Array<MonitorColumn> {
	const app = document.querySelector('monitor-app');

	return app.config.columns || defaultColumnConfig();
}

export function defaultColumnConfig(): Array<MonitorColumn> {
	return [
		{ id: 'usernameDisplayed', visible: true, align: "left"},
		{ id: 'environment', visible: true, align: "left"},
		{ id: 'computerName', visible: true, align: "left"},
		{ id: 'threadId', visible: true, align: "right"},
		{ id: 'server', visible: true, align: "left"},
		{ id: 'mainName', visible: true, align: "left"},
		{ id: 'loginTime', visible: true, align: "center"},
		{ id: 'elapsedTime', visible: true, align: "center"},
		{ id: 'totalInstrCount', visible: true, align: "right"},
		{ id: 'instrCountPerSec', visible: true, align: "right"},
		{ id: 'remark', visible: true, align: "left"},
		{ id: 'memUsed', visible: true, align: "right"},
		{ id: 'sid', visible: true, align: "right"},
		{ id: 'ctreeTaskId', visible: true, align: "right"},
		{ id: 'inactiveTime', visible: true, align: "center"},
		{ id: 'clientType', visible: true, align: "left"}
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
