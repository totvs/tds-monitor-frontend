import { LitElement, html, customElement, property, CSSResult, css } from 'lit-element';
import { TdsMonitorServer } from '@totvs/tds-languageclient';
import { monitorIcon } from './icon-monitor-svg';
import { MonitorUser } from '@totvs/tds-languageclient/target/TdsMonitorServer';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-item': MonitorServerItem;
	}
}

declare type ServerStatus = 'disconnected' | 'connecting' | 'connected';

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
	status: ServerStatus = 'disconnected';

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



	render() {
		return html`
			<section @click="${this.onLeftClick}" @contextmenu="${this.onRightClick}">
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
		let section = this.renderRoot.querySelector('section');

		if (!this.server) {
			this.dispatchEvent(new CustomEvent<string>('server-init', {
				detail: this.name,
				bubbles: true,
				composed: true
			}));

			section.classList.add('connecting');

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
			section.classList.remove('connecting');
			section.classList.add('error');

			this.dispatchEvent(new CustomEvent<string>('server-error', {
				detail: 'Nao foi possivel conectar ao servidor!',
				bubbles: true,
				composed: true
			}));

			return;
		}

		section.classList.remove('connecting');
		section.classList.add('connected');

		let users = await this.server.getUsers();

		this.dispatchEvent(new CustomEvent<MonitorUser[]>('server-connected', {
			detail: users,
			bubbles: true,
			composed: true
		}));
	}

	async onRightClick(event: MouseEvent) {

	}


}

