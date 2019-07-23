import { LitElement, html, customElement, CSSResult, TemplateResult } from 'lit-element';
import { MonitorUser } from '@totvs/tds-languageclient/target/TdsMonitorServer';
import { style } from '../css/monitor-body.css';

@customElement('monitor-body')
export class MonitorBody extends LitElement {

	constructor() {
		super();

		this.addEventListener('server-connected', this.onServerConnected);
		this.addEventListener('server-init', this.onBeginServerConnection);
		this.addEventListener('server-error', this.onServerError);
	}

	static get styles(): CSSResult {
		return style;
	}

	render(): TemplateResult {
		return html`
			<slot></slot>
        `;
	}


	onBeginServerConnection(event: CustomEvent<string>): boolean | void {
		let userList = this.querySelector('monitor-user-list');

		userList.users = [];
		userList.name = event.detail;
		userList.status = 'connecting';

		console.log('begin connnection to server ' + event.detail);
	}

	onServerConnected(event: CustomEvent<MonitorUser[]>): boolean | void {
		let userList = this.querySelector('monitor-user-list');

		userList.users = event.detail;
		userList.status = 'connected';

		console.log('onConnected', event.detail);
	}

	onServerError(event: CustomEvent<string>): boolean | void {
		let userList = this.querySelector('monitor-user-list');

		userList.users = [];
		userList.error = 'Não foi possivel conectar!';
		userList.status = 'error';
	}

}

