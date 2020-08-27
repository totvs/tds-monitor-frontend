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

interface MonitorSettingsConfig {
	language?: 'portuguese' | 'english' | 'spanish';
	updateInterval?: number;
	alwaysOnTop?: boolean;
	generateUpdateLog?: boolean;
	generateExecutionLog?: boolean;
	columnsConfig?: string;
}

interface MonitorSettingsServer {
	name: string;
	serverType: number,
	address: string;
	port: number;
	build: string;
	secure: boolean;
	token?: string;
}
