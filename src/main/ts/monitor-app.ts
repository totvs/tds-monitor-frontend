import { BuildVersion } from "@totvs/tds-languageclient";
import { customElement, html, LitElement } from "lit-element";
import { style } from "../css/monitor-app.css";
import { MonitorServerItemOptions } from "./monitor-server-item";

const DEFAULT_SETTINGS: MonitorSettings = {
	servers: [],
	config: {
		updateInterval: 0,
		language: "english",
		alwaysOnTop: false,
		generateUpdateLog: false,
		generateExecutionLog: false,
	},
};

export enum MessageType {
	ERROR = 1,
	WARNING = 2,
	INFO = 3,
	LOG = 4,
}

interface WindowLogMessage {
	type: MessageType;
	message: string;
}

@customElement("monitor-app")
class MonitorApp extends LitElement {
	private _settings: MonitorSettings = DEFAULT_SETTINGS;

	constructor() {
		super();

		this.addEventListener("server-connected", this.onServerConnected);
		this.addEventListener("server-init", this.onBeginServerConnection);
		this.addEventListener("server-error", this.onServerError);
		this.addEventListener("settings-update", this.onSettingsUpdate);

		const serverView = this.querySelector("monitor-server-view");

		languageClient.on("window/logMessage", (data: WindowLogMessage) => {
			serverView.log(data.message, data.type);
		});
	}

	get settings(): MonitorSettings {
		return this._settings;
	}

	set settings(settings: MonitorSettings) {
		this._settings = Object.assign({}, DEFAULT_SETTINGS, settings);

		let drawer = this.querySelector("monitor-drawer");

		// Ordena por nome
		this.settings.servers.sort(function (a, b) {
			return a.name.localeCompare(b.name);
		});

		this.settings.servers.forEach((data) => {
			let server = this.createServer(data);

			drawer.addServer({
				serverId: data.serverId,
				name: data.name,
				server,
			});
		});
	}

	get version(): string {
		return window.versions.main;
	}

	get dependencies(): Partial<Versions> {
		return {
			"@totvs/tds-languageclient":
				window.versions["@totvs/tds-languageclient"],
			"@totvs/tds-monitor-frontend":
				window.versions["@totvs/tds-monitor-frontend"],
		};
	}

	static get styles() {
		return style;
	}

	render() {
		return html` <slot></slot> `;
	}

	private createServer(data: MonitorSettingsServer) {
		let server = languageClient.createMonitorServer();

		server.id = data.name;
		server.serverType = data.serverType;
		server.address = data.address;
		server.port = data.port;
		if (data.build) {
			server.build = data.build as BuildVersion;
		}
		server.secure = data.secure;
		if (data.token) {
			server.token = data.token;
		}

		return server;
	}

	addServer(options: MonitorServerItemOptions) {
		this.settings.servers.push({
			serverId: options.serverId,
			name: options.name,
			serverType: options.server.serverType,
			address: options.server.address,
			port: options.server.port,
			build: options.server.build,
			secure: options.server.secure,
		});

		window.storage.set(this.settings);

		let drawer = this.querySelector("monitor-drawer");
		drawer.addServer({
			serverId: options.serverId,
			name: options.name,
			server: options.server,
		});
	}

	editServer(options: MonitorServerItemOptions) {
		this.settings.servers =
			this.settings.servers.map<MonitorSettingsServer>((server) => {
				if (server.serverId == options.serverId) {
					server.name = options.name;
					server.serverType = options.server.serverType;
					server.address = options.server.address;
					server.port = options.server.port;
					server.build = options.server.build;
					server.secure = options.server.secure;
					server.token = null;
					options.server.token = null;
				}
				return server;
			});

		window.storage.set(this.settings);

		let drawer = this.querySelector("monitor-drawer");
		drawer.editServer({
			serverId: options.serverId,
			name: options.name,
			server: options.server,
		});
	}

	removeServer(serverId: string) {
		this.settings.servers = this.settings.servers.filter(
			(server) => server.serverId !== serverId
		);

		window.storage.set(this.settings);

		let drawer = this.querySelector("monitor-drawer");
		drawer.removeServer(serverId);
	}

	storeConnectionToken(serverName: string, token: string) {
		let server = this.settings.servers.find(
			(server) => server.name === serverName
		);

		if (server) {
			server.token = token;

			window.storage.set(this.settings);
		}
	}

	get config(): MonitorSettingsConfig {
		return this.settings.config;
	}

	set config(value: MonitorSettingsConfig) {
		this.settings.config = value;

		window.storage.set(this.settings);
	}

	onBeginServerConnection(
		event: CustomEvent<MonitorServerItemOptions>
	): boolean | void {
		let serverView = this.querySelector("monitor-server-view");

		serverView.users = [];
		serverView.name = event.detail.name;
		serverView.server = event.detail.server;
		serverView.status = "connecting";

		console.log("begin connnection to server " + event.detail);
	}

	onServerConnected(
		event: CustomEvent<MonitorServerItemOptions>
	): boolean | void {
		let serverView = this.querySelector("monitor-server-view");

		serverView.users = event.detail.users;
		serverView.name = event.detail.name;
		serverView.server = event.detail.server;
		serverView.status = event.detail.server.isConnected
			? "connected"
			: "idle";

		console.log("onConnected", event.detail);
	}

	onServerError(event: CustomEvent<string>): boolean | void {
		let serverView = this.querySelector("monitor-server-view");

		serverView.users = [];
		serverView.error = event.detail; //'Não foi possivel conectar!';
		serverView.status = "error";
	}

	onSettingsUpdate(event: CustomEvent<string>): boolean | void {
		let serverView = this.querySelector("monitor-server-view");

		serverView.setServerUpdateInterval();

		//console.log('onSettingsUpdate');
	}
}

declare global {
	interface HTMLElementTagNameMap {
		"monitor-app": MonitorApp;
	}
}
