import { BuildVersion, MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-server-item.css';
import { monitorIcon } from './icon-monitor-svg';
import { MonitorAuthenticationDialog } from './monitor-authentication-dialog';
import { MenuOptions, MonitorMenu } from './monitor-menu';
import { MonitorOtherActionsDialog } from './monitor-other-actions-dialog';

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
			let result = await this.server.reconnect();

			if (!result) {
				connectionFailed = true;
			}
		}
		else {
			let dialog = new MonitorAuthenticationDialog(this),
				result = await dialog.showForResult();

			if (result) {
				result = await this.server.connect({
					username: dialog.username,
					password: dialog.password,
					environment: dialog.environment
				});

				if (result) {
					if (dialog.storeToken) {
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

		if (!connectionFailed) {
			this.status = 'connected';
		}
		else {
			this.status = 'error';

			if (dispatchEvents) {
				this.dispatchEvent(new CustomEvent<string>('server-error', {
					detail: 'Não foi possivel se conectar a este servidor.',
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
				detail: 'Não foi possivel se conectar a este servidor.',
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
				let sucess = await this.connectServer(true);

				if (sucess)
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
					/*
					{
						text: 'Editar Dados do Servidor',
					},
					*/
					{
						text: 'Excluir Servidor',
						callback: () => { this.deleteServer() },
						separator: true
					}
				]
			};

		if (this.status === 'disconnected') {
			options.items.push({
				text: 'Conectar',
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
					text: 'Desconectar',
					separator: true,
					callback: () => { this.disconnectServer() }
				});
			}

			if (this.status === 'connected') {
				options.items.push({
					text: 'Outras ações',
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

