import { BuildVersion, MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-server-item.css';
import { monitorIcon } from './icon-monitor-svg';
import { MonitorAuthenticationDialog } from './monitor-authentication-dialog';
import { MenuOptions, MonitorMenu } from './monitor-menu';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-item': MonitorServerItem;
	}
}

declare type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

export interface MonitorServerItemOptions {
	name: string;
	server: TdsMonitorServer;
}

@customElement('monitor-server-item')
export class MonitorServerItem extends LitElement {

	@property({ type: String })
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
		this.server = null;
		this.status = 'disconnected';

		return true;
	}

	async connectServer(dispatchEvents?: boolean): Promise<boolean> {
		this.status = 'connecting';

		if (dispatchEvents) {
			this.dispatchEvent(new CustomEvent<MonitorServerItemOptions>('server-init', {
				detail: {
					name: this.name,
					server: this.server
				},
				bubbles: true,
				composed: true
			}));
		}

		if (this.server.token !== null) {
			await this.server.reconnect();
		}
		else {
			let dialog = new MonitorAuthenticationDialog(this),
				result = await dialog.showForResult();

			if (result) {
				await this.server.connect({
					username: dialog.username,
					password: dialog.password,
					environment: dialog.environment
				});

				if (dialog.storeToken) {
					const app = document.querySelector('monitor-app');
					app.storeConnectionToken(this.name, this.server.token);
				}
			}
			else {
				if (dispatchEvents) {
					this.dispatchEvent(new CustomEvent<string>('server-error', {
						detail: 'Nao foi possivel conectar ao servidor!',
						bubbles: true,
						composed: true
					}));
				}
			}
		}

		if (this.server) {
			this.status = 'connected';
		}
		else {
			this.status = 'error';

			if (dispatchEvents) {
				this.dispatchEvent(new CustomEvent<string>('server-error', {
					detail: 'Nao foi possivel conectar ao servidor!',
					bubbles: true,
					composed: true
				}));
			}
		}

		return (this.status === 'connected');
	}

	async getUsers() {
		let users = await this.server.getUsers();

		this.dispatchEvent(new CustomEvent<MonitorUser[]>('server-connected', {
			detail: users,
			bubbles: true,
			composed: true
		}));
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
					{
						text: 'Editar Dados do Servidor',
					},
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
				if (this.enableNewConnections) {
					options.items.push({
						text: 'Desabilitar novas conexões'
					});
				}
				else {
					options.items.push({
						text: 'Habilitar novas conexões'
					});
				}

				options.items.push({
					text: 'Parar o servidor',
					callback: () => { this.stopServer() }
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

	stopServer() {
		this.server.stopServer();
	}
}

