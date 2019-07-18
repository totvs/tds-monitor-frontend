import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { style } from '../css/monitor-server-view.css';

export type ServerViewStatus = 'iddle' | 'connecting' | 'connected' | 'error';

@customElement('monitor-server-view')
export class MonitorServerView extends LitElement {

	@property({ type: String })
	name: string = '';

	@property({ type: Object })
	set server(value: TdsMonitorServer) {
		let oldValue = this._server;
		this._server = value;

		this.renderRoot.querySelector('monitor-user-list').server = value;
		this.requestUpdate('server', oldValue);
	}
	get server(): TdsMonitorServer {
		return this._server;
	}

	_server: TdsMonitorServer = null;

	@property({ type: String })
	error: string = '';

	@property({ type: String, reflect: true, attribute: true })
	status: ServerViewStatus = 'iddle';

	set users(value: MonitorUser[]) {
		this.renderRoot.querySelector('monitor-user-list').users = value;
	};

	constructor() {
		super();
	}

	static get styles(): CSSResult {
		return style;
	}

	render(): TemplateResult {

		/*
			<header>
				<h1>${'this.name'}</h1>
				<h2>${'this.address'}:${'this.port'}</h2>
			</header>
		*/
		return html`
			${this.server ? html`
			<header>
				<h2>${this.name} (${this.server.address}:${this.server.port})</h2>
			</header>
			` : ''}
			<monitor-user-list></monitor-user-list>
			<div class='messages'>
				<span class='connecting-message'>
					<label>Conectando ao servidor ${this.name}</label>
					<monitor-linear-progress></monitor-linear-progress>
				</span>
				<span class='error-message'>${this.error}</span>
			</div>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-view': MonitorServerView;
	}
}
