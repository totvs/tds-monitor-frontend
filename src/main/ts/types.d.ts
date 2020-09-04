interface Window {
	reload(): void;
	toggleDevTools(): void;
	restore(): void;
	maximize(): void;
	minimize(): void;

	storage: Storage;
	versions: Versions;
}

interface Versions {
	'main': string;
	'@totvs/tds-languageclient': string;
	'@totvs/tds-monitor-frontend': string;
}

declare module '*.css' {
	import { CSSResult } from 'lit-element';

	export const style: CSSResult;
}

interface JsonRpcMessage<T> {
	jsonrpc: string;
	method: string;
	params?: T;
}

interface Storage {
	get: () => MonitorSettings;
	set: (data: MonitorSettings) => void;
}

interface MonitorSettings {
	servers?: Array<MonitorSettingsServer>;
	config?: MonitorSettingsConfig
}

interface MonitorColumn {
	id: ColumnKey;
	visible: boolean;
	align: 'left' | 'right' | 'center';
	width: number;
}

interface SortInfo {
	order: string;
	column: ColumnKey;
}

interface ColumnData {
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

type ColumnKey = keyof ColumnData;

interface MonitorSettingsConfig {
	language?: 'portuguese' | 'english' | 'spanish';
	updateInterval?: number;
	alwaysOnTop?: boolean;
	generateUpdateLog?: boolean;
	generateExecutionLog?: boolean;
	columns?: MonitorColumn[];
	sortInfo?: SortInfo;
}

interface MonitorSettingsServer {
	serverId: string;
	name: string;
	serverType: number,
	address: string;
	port: number;
	build: string;
	secure: boolean;
	token?: string;
}
