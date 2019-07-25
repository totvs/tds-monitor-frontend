import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { style } from '../css/monitor-server-view.css';
import { MessageType } from './monitor-app';

export type ServerViewStatus = 'iddle' | 'connecting' | 'connected' | 'error';

@customElement('monitor-server-view')
export class MonitorServerView extends LitElement {

	@property({ type: String })
	name: string = '';

	@property({ type: Boolean, reflect: true, attribute: true })
	showlog: boolean = false;

	@property({ type: Object })
	set server(value: TdsMonitorServer) {
		let oldValue = this._server;
		this._server = value;

		this.setServerUpdateInterval();

		this.renderRoot.querySelector('monitor-user-list').server = value;
		this.requestUpdate('server', oldValue);
	}
	get server(): TdsMonitorServer {
		return this._server;
	}

	_updateHandler: number = null;
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
			<monitor-log-view></monitor-log-view>
		`;
	}

	setServerUpdateInterval() {
		const app = document.querySelector('monitor-app');

		if (this._updateHandler !== null) {
			window.clearInterval(this._updateHandler);
		}

		if (app.config.updateInterval > 0) {
			this._updateHandler = window.setInterval(() => {
				if (this.server) {
					this.server.getUsers()
					.then(users => this.users = users);
				}
			}, (app.config.updateInterval * 1000));
		}
	}

	log(message: string, type: MessageType) {
		const logViewer = this.renderRoot.querySelector('monitor-log-view');

		logViewer.add(message, type);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-view': MonitorServerView;
	}
}
