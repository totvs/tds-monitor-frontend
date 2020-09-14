import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { style } from '../css/monitor-server-view.css';
import { MessageType } from './monitor-app';
import { i18n } from './util/i18n';

export type ServerViewStatus = 'idle' | 'connecting' | 'connected' | 'error';

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
	status: ServerViewStatus = 'idle';

	set users(value: MonitorUser[]) {
		this.renderRoot.querySelector('monitor-user-list').users = value;

		this.requestUpdate('users');
	};
	get users() {
		return this.renderRoot.querySelector('monitor-user-list').users;
	}

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
					<label>${i18n.localize("CONNECTING_SERVER", "Connecting to server {0}", this.name)}</label>
					<monitor-linear-progress indeterminate></monitor-linear-progress>
				</span>
				<span class='error-message'>${this.error}</span>
			</div>
			<monitor-log-view></monitor-log-view>
		`;
	}

	setServerUpdateInterval() {
		const app = document.querySelector('monitor-app');

		this.setUpdateInterval(app.config.updateInterval * 1000);

		if (this.server) {
			this.server.getUsers()
				.then(users => this.users = users);
		}
	}

	setUpdateInterval(interval: number) {
		if (this._updateHandler) {
			clearTimeout(this._updateHandler);
			this._updateHandler = null;
		}

		if (interval === 0)
			return;

		const update = () => {
			if (this.server) {
				this.server.getUsers()
					.then(users => this.users = users)
					.then(() => {
						//console.log('updating');
						this._updateHandler = window.setTimeout(() => update(), interval);
					});
			}
		}

		this._updateHandler = window.setTimeout(() => update(), interval);
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
