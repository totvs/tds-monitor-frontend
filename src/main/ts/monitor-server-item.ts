import { LitElement, html, customElement, property, CSSResult } from 'lit-element';
import { monitorIcon } from './icon-monitor-svg';
import { TdsMonitorServer, MonitorUser } from '@totvs/tds-languageclient';
import { MonitorMenu, MenuOptions } from './monitor-menu';
import { style } from '../css/monitor-server-item.css';
import { MonitorAuthenticationDialog } from './monitor-authentication-dialog';
import { BuildVersion } from "@totvs/tds-languageclient";

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
			this.dispatchEvent(new CustomEvent<string>('server-init', {
				detail: this.name,
				bubbles: true,
				composed: true
			}));
		}

		if (this.server.token !== null) {
			await this.server.reconnect();
		}
		else {
			await this.server.connect({
				username: this.user,
				password: this.password,
				environment: this.environment
			});

		}

		/*
		this.server = await languageClient.getMonitorServer({
			connType: 1,
			identification: '',
			server: this.address,
			port: this.port,
			buildVersion: this.build,
			environment: this.environment,
			user: this.user,
			password: this.password,
			autoReconnect: true
		});

		console.log('server', this.server);
		*/

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
				let result = true;

				if (this.server.token === null) {
					let dialog = new MonitorAuthenticationDialog(this);

					result = await dialog.showForResult();
				}


				if (result) {
					let sucess = await this.connectServer(true);

					if (sucess)
						await this.getUsers();
				}

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

		/*

		//let section = this.renderRoot.querySelector('section');

		//section.classList.remove('error', 'connecting', 'connected');

		this.status = 'connecting';

		if (!this.server) {
			this.dispatchEvent(new CustomEvent<string>('server-init', {
				detail: this.name,
				bubbles: true,
				composed: true
			}));

			this.status = 'connecting';
			//section.classList.add('connecting');

			this.server = await languageClient.getMonitorServer({
				connType: 1,
				identification: '',
				server: this.address,
				port: this.port,
				buildVersion: '7.00.170117A',
				environment: 'LOBO-GUARA',
				user: 'admin',
				password: '',
				autoReconnect: true
			});
		}

		if (!this.server) {
			this.status = 'error';

			this.dispatchEvent(new CustomEvent<string>('server-error', {
				detail: 'Nao foi possivel conectar ao servidor!',
				bubbles: true,
				composed: true
			}));

			return;
		}

		this.status = 'connected';

		let users = await this.server.getUsers();

		this.dispatchEvent(new CustomEvent<MonitorUser[]>('server-connected', {
			detail: users,
			bubbles: true,
			composed: true
		}));
		*/
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
					text: 'Parar o servidor'
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


}

