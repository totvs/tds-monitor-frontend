import { LitElement, html, customElement } from 'lit-element';
import { MonitorServerItemOptions } from './monitor-server-item';
import { MonitorUser } from '@totvs/tds-languageclient';
import { MonitorSettings } from './types';
import { style } from '../css/monitor-app.css';

@customElement('monitor-app')
class MonitorApp extends LitElement {

	private _settings: MonitorSettings = {
		servers: []
	};

	constructor() {
		super();

		this.addEventListener('server-connected', this.onServerConnected);
		this.addEventListener('server-init', this.onBeginServerConnection);
		this.addEventListener('server-error', this.onServerError);
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
			server.id = data.name;
			server.address = data.address;
			server.port = data.port;

			if (data.build) {
				server.build = data.build;
			}

			if (data.token) {
				server.token = data.token;
			}

			return { name: data.name, server }
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
			port: options.server.port,
			build: options.server.build
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



	onBeginServerConnection(event: CustomEvent<string>): boolean | void {
		let serverView = this.querySelector('monitor-server-view');

		serverView.users = [];
		serverView.name = event.detail;
		serverView.status = 'connecting';

		console.log('begin connnection to server ' + event.detail);
	}

	onServerConnected(event: CustomEvent<MonitorUser[]>): boolean | void {
		let serverView = this.querySelector('monitor-server-view');

		serverView.users = event.detail;
		serverView.status = 'connected';

		console.log('onConnected', event.detail);
	}

	onServerError(event: CustomEvent<string>): boolean | void {
		let serverView = this.querySelector('monitor-server-view');

		serverView.users = [];
		serverView.error = 'Não foi possivel conectar!';
		serverView.status = 'error';
	}


}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-app': MonitorApp;
	}
}
