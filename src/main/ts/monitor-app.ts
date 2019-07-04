import { LitElement, html, css, customElement } from 'lit-element';


declare global {
	interface HTMLElementTagNameMap {
		'monitor-app': MonitorApp;
	}
}

@customElement('monitor-app')
class MonitorApp extends LitElement {


	private _settings: MonitorSettings = {};

	constructor() {
		super();
	}

	get settings(): MonitorSettings {
		return this._settings;
	}

	set settings(settings: MonitorSettings) {
		this._settings = settings;

		let drawer = this.querySelector('monitor-drawer');

		drawer.servers = settings.servers;
	}



	static get styles() {
		super.styles;

		return [
			css`
				:host {
					position: absolute;
					display: flex;
					flex-direction: column;
					align-items: stretch;
					top: 0;
					bottom: 0;
					left: 0;
					right: 0;
					border: 0;
					padding: 0;
					margin: 0;
				}
			`,
		];
	}

	render() {
		return html`
			<slot></slot>
    	`;
	}
}
