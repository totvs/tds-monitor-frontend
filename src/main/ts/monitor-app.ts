import { LitElement, html, customElement } from 'lit-element';
import { style } from '../css/monitor-app.css';
import { MonitorServerItemOptions } from './monitor-server-item';

@customElement('monitor-app')
class MonitorApp extends LitElement {

	private _settings: MonitorSettings = {
		servers: []
	};

	constructor() {
		super();
	}

	get settings(): MonitorSettings {
		return this._settings;
	}

	set settings(settings: MonitorSettings) {
		this._settings = Object.assign({
			servers: []
		}, settings);

		let drawer = this.querySelector('monitor-drawer');

		let s = this.settings.servers.map((data) => {
			let server = languageClient.createMonitorServer();
			server.address = data.address;
			server.port = data.port;

			//server.validate();

			return { ...data, server }
		});

		console.log('servers', s);

		drawer.servers = s;
	}

	static get styles() {
		return style;
	}

	render() {
		return html`
			<slot></slot>
    	`;
	}

	addServer(options: MonitorServerItemOptions) {
		this.settings.servers.push({
			name: options.name,
			address: options.server.address,
			port: options.server.port
		});

		let drawer = this.querySelector('monitor-drawer');

		drawer.servers = Array.from(drawer.servers).concat(options);

		window.localStorage.setItem('settings', JSON.stringify(this.settings));
	}

	removeServer(serverName: string) {
		this.settings.servers = this.settings.servers.filter((server => server.name !== serverName));

		let drawer = this.querySelector('monitor-drawer');

		drawer.servers = drawer.servers.filter((server => server.name !== serverName));

		window.localStorage.setItem('settings', JSON.stringify(this.settings));
	}

}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-app': MonitorApp;
	}
}
