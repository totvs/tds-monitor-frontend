import { MonitorUser } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-user-list-row.css';
import { columnConfig } from './monitor-columns';
import { MenuOptions, MonitorMenu } from './monitor-menu';
import { i18n } from './util/i18n';

export interface UsersActionOptions {
	action: string;
	users: Array<MonitorUser>;
}

@customElement('monitor-user-list-row')
export class MonitorUserListRow extends LitElement {

	@property({ type: String, reflect: true, attribute: true })
	usernameDisplayed = '';

	@property({ type: String, reflect: true, attribute: true })
	username = '';

	@property({ type: String, reflect: true, attribute: true })
	environment = '';

	@property({ type: String, reflect: true, attribute: true })
	computerName = '';

	@property({ type: String, reflect: true, attribute: true })
	threadId = '';

	@property({ type: String, reflect: true, attribute: true })
	server = '';

	@property({ type: String, reflect: true, attribute: true })
	mainName = '';

	@property({ type: String, reflect: true, attribute: true })
	get loginTime(): string {
		return this._loginTime;
	}
	set loginTime(value: string) {
		this._loginTime = new Date(value).toLocaleString();
	}

	_loginTime = '';

	@property({ type: String, reflect: true, attribute: true })
	elapsedTime = '';

	@property({ type: String, reflect: true, attribute: true })
	totalInstrCount = '';

	@property({ type: String, reflect: true, attribute: true })
	instrCountPerSec = '';

	@property({ type: String, reflect: true, attribute: true })
	remark = '';

	@property({ type: String, reflect: true, attribute: true })
	memUsed = '';

	@property({ type: String, reflect: true, attribute: true })
	sid = '';

	@property({ type: String, reflect: true, attribute: true })
	ctreeTaskId = '';

	@property({ type: String, reflect: true, attribute: true })
	inactiveTime = '';

	@property({ type: String, reflect: true, attribute: true })
	clientType = '';

	@property({ type: Boolean, reflect: true, attribute: true })
	checked = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	set visible(value: boolean) {
		const oldValue = this.visible;

		if (value)
			this.style.removeProperty('display');
		else
			this.style.display = 'none';

		this.requestUpdate('visible', oldValue);
	}
	get visible() {
		return this.style.display !== 'none';
	}

	constructor(user: MonitorUser) {
		super();
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		const checkbox = this.renderRoot.querySelector('monitor-checkbox');

		checkbox.onchange = null;
		checkbox.parentElement.removeChild(checkbox);
	}

	static get styles(): CSSResult {
		return style;
	}


	render() {
		const columns = columnConfig()
			.filter(column => column.visible);

		return html`
			<td>
				<monitor-checkbox ?checked="${this.checked}" @change="${this.onCheckBoxChanged}"></monitor-checkbox>
			</td>
			${columns.map((column) => html`
				<td class="${column.align}"><div style="width:${column.width}px" title="${this[column.id]}" @contextmenu="${this.onRightClick}">${this[column.id]}</div></td>
			`)}
        `;
	}

	onCheckBoxChanged(event: Event) {
		const checkbox = this.renderRoot.querySelector('monitor-checkbox');

		if (checkbox.checked) {
			this.setAttribute('checked', '');
		}
		else {
			this.removeAttribute('checked');
		}

		var newEvent = new Event('change', Object.assign({}, event, {
			target: this,
			srcElement: this,
			currentTarget: this,
			composed: true
		}));

		this.dispatchEvent(newEvent);
	}

	async onRightClick(event: MouseEvent) {
		let user: MonitorUser = {
			username: this.username,
			computerName: this.computerName,
			threadId: Number.parseInt(this.threadId),
			server: this.server,
			mainName: this.mainName,
			environment: this.environment,
			loginTime: this.loginTime,
			elapsedTime: this.elapsedTime,
			totalInstrCount: Number.parseInt(this.totalInstrCount),
			instrCountPerSec: Number.parseInt(this.instrCountPerSec),
			remark: this.remark,
			memUsed: Number.parseInt(this.memUsed),
			sid: this.sid,
			ctreeTaskId: Number.parseInt(this.ctreeTaskId),
			clientType: this.clientType,
			inactiveTime: this.inactiveTime,
			appUser: 'this.appUser'
		}
		let menu: MonitorMenu,
			options: MenuOptions = {
				parent: this,
				position: {
					x: event.pageX,
					y: event.pageY,
				},
				items: [
					{
						text: i18n.localize("DO_SEND_MESSAGE", "Send Message"),
						callback: () => { this.sendMessage(user) },
						separator: true
					},
					{
						text: i18n.localize("DO_DISCONNECT", "Disconnect"),
						callback: () => { this.killUser(user) },
						separator: true
					}
				]
			};

		menu = new MonitorMenu(options);
		menu.open = true;
	}

	sendMessage(user: MonitorUser) {
		this.dispatchEvent(new CustomEvent<UsersActionOptions>('users-action', {
			detail: {
				action: 'send-message',
				users: [ user ]
			},
			bubbles: true,
			composed: true
		}));
	}

	killUser(user: MonitorUser) {
		this.dispatchEvent(new CustomEvent<UsersActionOptions>('users-action', {
			detail: {
				action: 'kill-user',
				users: [ user ]
			},
			bubbles: true,
			composed: true
		}));
	}

}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list-row': MonitorUserListRow;
	}
}
