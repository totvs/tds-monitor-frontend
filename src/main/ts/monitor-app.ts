import { LitElement, html, customElement } from 'lit-element';
import { MonitorServerItemOptions } from './monitor-server-item';
import { MonitorUser } from '@totvs/tds-languageclient';
import { MonitorSettings, MonitorSettingsConfig, Server } from './types';
import { style } from '../css/monitor-app.css';

const DEFAULT_SETTINGS: MonitorSettings = {
	servers: [],
	config: {
		updateInterval: 5,
		language: "portuguese",
		alwaysOnTop: false,
		generateUpdateLog: false,
		generateExecutionLog: false
	}
};

@customElement('monitor-app')
class MonitorApp extends LitElement {

	private _settings: MonitorSettings = DEFAULT_SETTINGS;

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
		this._settings = Object.assign({}, DEFAULT_SETTINGS, settings);

		let drawer = this.querySelector('monitor-drawer');

		this.settings.servers.forEach((data) => {
			let server = this.createServer(data);

			drawer.addServer({ name: data.name, server });
		});
	}


	static get styles() {
		return style;
	}

	render() {
		return html`
			<slot></slot>
    	`;
	}

	private createServer(data: Server) {
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

		return server;
	}

	addServer(options: MonitorServerItemOptions) {
		this.settings.servers.push({
			name: options.name,
			address: options.server.address,
			port: options.server.port,
			build: options.server.build
		});
		window.localStorage.setItem('settings', JSON.stringify(this.settings));

		let drawer = this.querySelector('monitor-drawer');
		drawer.addServer(options);
	}

	removeServer(serverName: string) {
		this.settings.servers = this.settings.servers.filter((server => server.name !== serverName));
		window.localStorage.setItem('settings', JSON.stringify(this.settings));

		let drawer = this.querySelector('monitor-drawer');
		drawer.removeServer(serverName);
	}

	storeConnectionToken(serverName: string, token: string) {
		let server = this.settings.servers.find((server) => server.name === serverName);

		if (server) {
			server.token = token;

			window.localStorage.setItem('settings', JSON.stringify(this.settings));
		}
	}

	get config(): MonitorSettingsConfig {
		return this.settings.config;
	}

	set config(value: MonitorSettingsConfig) {
		this.settings.config = value;

		window.localStorage.setItem('settings', JSON.stringify(this.settings));
	}

	onBeginServerConnection(event: CustomEvent<MonitorServerItemOptions>): boolean | void {
		let serverView = this.querySelector('monitor-server-view');

		serverView.users = [];
		serverView.name = event.detail.name;
		serverView.server = event.detail.server;
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
