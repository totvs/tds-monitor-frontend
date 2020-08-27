import { BuildVersion, MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-server-item.css';
import { monitorIcon } from './icon-monitor-svg';
import { MonitorConnectionDialog } from './monitor-connection-dialog';
import { MonitorAuthenticationDialog } from './monitor-authentication-dialog';
import { MenuOptions, MonitorMenu } from './monitor-menu';
import { MonitorOtherActionsDialog } from './monitor-other-actions-dialog';
import { i18n } from './util/i18n';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-item': MonitorServerItem;
	}
}

declare type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MonitorServerItemOptions {
	name: string;
	server: TdsMonitorServer;
	users?: MonitorUser[];
}

@customElement('monitor-server-item')
export class MonitorServerItem extends LitElement {

	@property({ type: String, reflect: true, attribute: true })
	name: string;

	@property({ type: String })
	address: string;

	@property({ type: Number })
	port: number;

	build: BuildVersion;

	environment: string;

	user: string;

	password: string;

	@property({ type: String })
	status: ConnectionStatus = 'disconnected';

	@property({ type: Boolean })
	enableNewConnections: boolean = true;

	server: TdsMonitorServer = null;

	constructor(options: MonitorServerItemOptions) {
		super();

		this.server = options.server;

		this.name = options.name;
		this.address = this.server.address;
		this.port = this.server.port;
		this.build = this.server.build;
	}

	static get styles(): CSSResult {
		return style;
	}

	async disconnectServer(): Promise<boolean> {
		this.server.disconnect();

		this.status = 'disconnected';

		return true;
	}

	async connectServer(dispatchEvents?: boolean): Promise<boolean> {
		let connectionFailed = false;
		this.status = 'connecting';

		if (dispatchEvents) {
			this.dispatchEvent(new CustomEvent<MonitorServerItemOptions>('server-init', {
				detail: {
					name: this.name,
					server: this.server,
					users: []
				},
				bubbles: true,
				composed: true
			}));
		}

		if (this.server.token !== null) {
			let result = await this.server.reconnect({ encoding: 'CP1252' });

			if (!result) {
				result = await this.server.reconnect({ encoding: 'CP1251' });
			}

			if (!result) {
				connectionFailed = true;
			}
		}
		else {
			let connDialog = new MonitorConnectionDialog(this),
				connResult = await connDialog.showForResult();

			if (connResult) {
				connResult = await this.server.connect(this.name, this.server.serverType, this.server.address, this.server.port, this.server.secure, this.build, connDialog.environment);

				if (connResult) {
					let authDialog = new MonitorAuthenticationDialog(this),
						authResult = await authDialog.showForResult();

					if (authResult) {
						// Try to authenticate using latin codepage
						authResult = await this.server.authenticate(authDialog.username, authDialog.password, 'CP1252');

						if (!authResult) {
							// Try to authenticate using cyrillic codepage
							await this.server.connect(this.name, this.server.serverType, this.server.address, this.server.port, this.server.secure, this.build, connDialog.environment);
							authResult = await this.server.authenticate(authDialog.username, authDialog.password, 'CP1251');
						}

						if (authResult) {
							if (authDialog.storeToken) {
								const app = document.querySelector('monitor-app');
								app.storeConnectionToken(this.name, this.server.token);
							}
						}
						else {
							connectionFailed = true;
						}
					}
					else {
						connectionFailed = true;
					}
				}
				else {
					connectionFailed = true;
				}
			}
			else {
				connectionFailed = true;
			}
		}

		if (!connectionFailed) {
			this.status = 'connected';
		}
		else {
			this.status = 'error';

			if (dispatchEvents) {
				this.dispatchEvent(new CustomEvent<string>('server-error', {
					detail: i18n.localize("UNABLE_CONNECT", "It was not possible to connect to this server."),
					bubbles: true,
					composed: true
				}));
			}
		}

		return (this.status === 'connected');
	}

	async getUsers() {
		let users = await this.server.getUsers();

		if (users != null) {
			this.dispatchEvent(new CustomEvent<MonitorServerItemOptions>('server-connected', {
				detail: {
					name: this.name,
					server: this.server,
					users: users
				},
				bubbles: true,
				composed: true
			}));
		} else {
			this.status = 'error';

			this.dispatchEvent(new CustomEvent<string>('server-error', {
				detail: i18n.localize("UNABLE_CONNECT", "It was not possible to connect to this server."),
				bubbles: true,
				composed: true
			}));
		}
	}


	render() {
		return html`
			<section class="${this.status}" @click="${this.onLeftClick}" @contextmenu="${this.onRightClick}">
				<monitor-ripple></monitor-ripple>
				${monitorIcon}
				<label>
					<h1>${this.name}</h1>
					<span>${this.address}:${this.port}</span>
				</label>
			</section>
		`;
	}

	async onLeftClick(event: MouseEvent) {
		switch (this.status) {
			case 'disconnected':
			case 'error':
				let success = await this.connectServer(true);

				if (success)
					await this.getUsers();

				break;
			case 'connecting':
				//Do nothing

				break;
			case 'connected':
				await this.getUsers();

				break;
			default:
				break;
		}
	}

	async onRightClick(event: MouseEvent) {
		let menu: MonitorMenu,
			options: MenuOptions = {
				parent: this,
				position: {
					x: event.pageX,
					y: event.pageY,
				},
				items: [
					{
						text: i18n.localize("DELETE_SERVER", "Delete Server"),
						callback: () => { this.deleteServer() },
						separator: true
					}
				]
			};

		if (this.status === 'disconnected') {
			options.items.push({
				text: i18n.localize("CONNECT", "Connect"),
				separator: true,
				callback: () => { this.connectServer(false) }
			});
			// options.items.push({
			// 	text: 'Habilitar novas conexões',
			// 	callback: () => { this.setConnectionStatus(true) }
			// });
		}
		else {
			if (this.status !== 'error') {
				options.items.push({
					text: i18n.localize("DISCONNECT", "Disconnect"),
					separator: true,
					callback: () => { this.disconnectServer() }
				});
			}

			if (this.status === 'connected') {
				options.items.push({
					text: i18n.localize("OTHER_ACTIONS", "Other actions"),
					callback: () => {
						this.otherActions();
					}
				});
			}
		}

		menu = new MonitorMenu(options);
		menu.open = true;

	}

	deleteServer() {
		const app = document.querySelector('monitor-app');
		app.removeServer(this.name);
	}

	async otherActions() {
		await this.server.getConnectionStatus()
			.then((status) => this.enableNewConnections = status);

		let dialog = new MonitorOtherActionsDialog(this.server, this.enableNewConnections);
		dialog.show();
	}
}

