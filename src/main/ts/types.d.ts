interface Window {
	reload(): void;
	toggleDevTools(): void;
	restore(): void;
	maximize(): void;
	minimize(): void;
}

declare module '*.css' {
	import { CSSResult } from 'lit-element';

	export const style: CSSResult;
}
