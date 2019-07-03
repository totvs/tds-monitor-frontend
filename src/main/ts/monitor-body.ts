import { LitElement, html, css, customElement, CSSResult } from 'lit-element';
import { MonitorUser } from '@totvs/tds-languageclient/target/TdsMonitorServer';

@customElement('monitor-body')
export class MonitorBody extends LitElement {

	constructor() {
		super();

		this.addEventListener('server-connected', this.onServerConnected);
		this.addEventListener('server-init', this.onBeginServerConnection);
		this.addEventListener('server-error', this.onServerError);
	}

	static get styles(): CSSResult {
		return css`
            :host {
                flex-grow: 1;
				display: flex;
				overflow: hidden;
            }
            `;
	}

	render() {
		return html`
			<slot></slot>
        `;
	}

	onBeginServerConnection(event: CustomEvent<string>) {
		let userList = this.querySelector('monitor-user-list');

		userList.users = [];
		userList.name = event.detail;
		userList.status = 'connecting';

		console.log('begin connnection to server ' + event.detail);
	}

	onServerConnected(event: CustomEvent<MonitorUser[]>) {
		let userList = this.querySelector('monitor-user-list');

		userList.users = event.detail;
		userList.status = 'connected';

		console.log('onConnected', event.detail);
	}

	onServerError(event: CustomEvent<string>) {
		let userList = this.querySelector('monitor-user-list');

		userList.users = [];
		userList.error = 'Não foi possivel conectar!';
		userList.status = 'error';
	}

}

