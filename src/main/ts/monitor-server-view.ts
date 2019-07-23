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
			<footer></footer>
		`;
	}

	setServerUpdateInterval() {
		const app = document.querySelector('monitor-app');

		if (this._updateHandler !== null) {
			window.clearInterval(this._updateHandler);
		}

		this._updateHandler = window.setInterval(() => {
			this.server.getUsers()
				.then(users => this.users = users);
		}, (app.config.updateInterval * 1000));
	}

	log(message: string, type: MessageType) {
		const span = document.createElement('span'),
			footer = this.renderRoot.querySelector('footer');

		switch (type) {
			case MessageType.ERROR:
				span.innerHTML = "[ERROR] ";
				break;
			case MessageType.WARNING:
				span.innerHTML = "[WARN&nbsp;] ";
				break;
			case MessageType.INFO:
				span.innerHTML = "[INFO&nbsp;] ";
				break;
			case MessageType.LOG:
				span.innerHTML = "[LOG&nbsp;&nbsp;] ";
				break;
			default:
				span.innerHTML = "[&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;] ";
				break;
		}

		span.innerHTML += message;

		footer.append(span);
		footer.scrollTop = footer.scrollHeight;

		if (footer.childElementCount > 200) {
			footer.removeChild(footer.children[0]);
		}
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-view': MonitorServerView;
	}
}
