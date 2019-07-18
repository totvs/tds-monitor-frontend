import { BuildVersion } from '@totvs/tds-languageclient';
import { CSSResult } from 'lit-element';

export interface MonitorSettings {
	servers?: Array<Server>;
	config?: MonitorSettingsConfig
}

export interface MonitorSettingsConfig {
	language?: 'portuguese' | 'english' | 'spanish';
	updateInterval?: number;
	alwaysOnTop?: boolean;
	generateUpdateLog?: boolean;
	generateExecutionLog?: boolean;
}

interface Server {
	name: string;
	address: string;
	port: number;
	build: BuildVersion;
	token?: string;
}

interface Window {
	reload(): void;
	toggleDevTools(): void;
}


declare module '*.css' {
	export const style: CSSResult;
}
