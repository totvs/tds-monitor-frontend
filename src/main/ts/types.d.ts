interface Window {
	reload(): void;
	toggleDevTools(): void;
	restore(): void;
	maximize(): void;
	minimize(): void;

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

