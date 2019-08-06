import { MonitorUser } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-user-list-row.css';

@customElement('monitor-user-list-row')
export class MonitorUserListRow extends LitElement {

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
	loginTime = '';

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
		return html`
			<td>
				<monitor-checkbox ?checked="${this.checked}" @change="${this.onCheckBoxChanged}"></monitor-checkbox>
			</td>
			<td class="left">${this.username}</td>
			<td class="left">${this.environment}</td>
			<td class="left">${this.computerName}</td>
			<td class="right">${this.threadId}</td>
			<td class="left">${this.server}</td>
			<td class="left">${this.mainName}</td>
			<td class="center">${this.loginTime}</td>
			<td class="center">${this.elapsedTime}</td>
			<td class="right">${this.totalInstrCount}</td>
			<td class="right">${this.instrCountPerSec}</td>
			<td class="left">${this.remark}</td>
			<td class="right">${this.memUsed}</td>
			<td class="right">${this.sid}</td>
			<td class="right">${this.ctreeTaskId}</td>
			<td class="center">${this.inactiveTime}</td>
			<td class="left">${this.clientType}</td>
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

}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list-row': MonitorUserListRow;
	}
}
