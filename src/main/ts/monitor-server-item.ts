import { LitElement, html, customElement, property, CSSResult, css } from 'lit-element';
import { TdsMonitorServer } from '@totvs/tds-languageclient';
import { monitorIcon } from './icon-monitor-svg';
import { MonitorUser } from '@totvs/tds-languageclient/target/TdsMonitorServer';
import { MonitorMenu, MenuOptions } from './monitor-menu';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-item': MonitorServerItem;
	}
}

declare type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | "error";

/*extends Drawer*/
@customElement('monitor-server-item')
export class MonitorServerItem extends LitElement {

	@property({ type: String })
	name: string;

	@property({ type: String })
	address: string;

	@property({ type: Number })
	port: number;

	@property({ type: String })
	status: ConnectionStatus = 'disconnected';

	@property({ type: Boolean })
	enableNewConnections: boolean = true;

	server: TdsMonitorServer = null;

	constructor(server: Server) {
		super();

		this.name = server.name;
		this.address = server.address;
		this.port = server.port;
	}


	static get styles(): CSSResult {
		return css`
			:host {
				margin: 2px 0;
			}

			@keyframes colorChange {
				0% {fill: #FFFFFF }
				50% {fill: #FFFF00 }
				100% {fill: #FFFFFF }
			}

			.connecting svg .server {
				animation: colorChange 1s infinite;
			}

			.connected svg .server {
				fill: #009900;
			}

			.error svg .server {
				fill: #FF0000;
			}

			.strokes {
				stroke: #808080;
				fill: #808080;
			}

			.connected .strokes {
				stroke: #000000;
				fill: #000000;
			}

			* {
				user-select: none;
			}

			section {
				padding: 10px 15px;
				display: flex;
				flex-direction: row;
			}

 			svg {
				vertical-align: middle;
				margin: 8px;
			}

			label {
				flex-grow: 1;
				display: flex;
				flex-direction: column;
				margin: auto;
			}

			label h1 {
				display: inline;
				vertical-align: middle;
				font-size: 14px;
				margin: 5px 0;
				flex-grow: 1;
			}

			label span {
				font-size: 10px;
				color: gray;
			}
		`;
	}

	async disconnectServer(): Promise<boolean> {
		//this.server.disconnect();
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
				<mwc-ripple></mwc-ripple>
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

		if (options.items[options.items.length - 1].separator)
			options.items[options.items.length - 1].separator = false;

		menu = new MonitorMenu(options);

		menu.open = true;

	}


}

