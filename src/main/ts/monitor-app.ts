import { LitElement, html, customElement } from 'lit-element';
import { style } from '../css/monitor-app.css';

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
		return style;
	}

	render() {
		return html`
			<slot></slot>
    	`;
	}

	addServer(newServer: Server) {
		this.settings.servers.push(newServer);

		let drawer = this.querySelector('monitor-drawer');

		drawer.servers = Array.from(this.settings.servers);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-app': MonitorApp;
	}
}
