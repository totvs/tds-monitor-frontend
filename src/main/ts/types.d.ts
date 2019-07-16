import { BuildVersion } from '@totvs/tds-languageclient';

interface MonitorSettings {
	servers?: Array<Server>;
}

interface Server {
	name: string;
	address: string;
	port: number;
	build: BuildVersion;
}

interface Window {
	reload(): void;
	toggleDevTools(): void;
}


declare module '*.css' {
	import { CSSResult } from "lit-element";

	export const style: CSSResult;
}
