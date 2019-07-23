interface MonitorSettings {
	servers?: Array<Server>;
}

interface Server {
	name: string;
	address: string;
	port: number;
}

interface Window {
	reload(): void;
	toggleDevTools(): void;
}


declare module '*.css' {
	import { CSSResult } from "lit-element";

	export const style: CSSResult;
}
