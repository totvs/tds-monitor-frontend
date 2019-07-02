import { LitElement, html, customElement, property, CSSResult, css } from 'lit-element';
import { TdsMonitorServer } from '@totvs/tds-languageclient';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-item': MonitorServerItem;
	}
}

/*extends Drawer*/
@customElement('monitor-server-item')
export class MonitorServerItem extends LitElement {

	@property({type: String})
	name: string;

	@property({type: String})
	address: string;

	@property({type: Number})
	port: number;

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

			* {
				user-select: none;
			}

			section {
				padding: 10px 15px;
				display: flex;
				flex-direction: row;
			}

 			img {
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
			<section @click="${this.onClicked}">
				<mwc-ripple></mwc-ripple>
				<img src='./monitor.svg' height="30" width="30">
				<label>
					<h1>${this.name}</h1>
					<span>${this.address}:${this.port}</span>
				</label>
			</section>
		`;
	}

	async onClicked(event: Event) {
		if (!this.server) {

			this.server = await languageClient.getMonitorServer({
				connType: 1,
				identification: '',
				server: this.address,
				port: this.port,
				buildVersion: '7.00.170117A',
				environment:  'LOBO-GUARA',
				user: 'admin',
				password: '',
				autoReconnect: true
			})

			if (this.server) {
				let users = await this.server.getUsers();

				console.log(users);
			}

		}

	}

}

