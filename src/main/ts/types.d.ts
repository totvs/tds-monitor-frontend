import { BuildVersion } from '@totvs/tds-languageclient';
import { CSSResult } from 'lit-element';

export interface MonitorSettings {
	servers?: Array<Server>;
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
