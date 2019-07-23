import { MonitorUser } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-user-list-row.css';
import { MonitorCheckbox } from './monitor-checkbox';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list-row': MonitorUserListRow;
	}
}

@customElement('monitor-user-list-row')
export class MonitorUserListRow extends LitElement {

	@property({ type: Object })
	user: MonitorUser = null;

	@property({type: Boolean, reflect: true, attribute: true})
	checked = false;

	constructor(user: MonitorUser) {
		super();

		this.user = user;
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<td>
				<monitor-checkbox ?checked="${this.checked}" @change="${this.onCheckBoxChanged}"></monitor-checkbox>
			</td>
			<td class="left">${this.user.username}</td>
			<td class="left">${this.user.environment}</td>
			<td class="left">${this.user.computerName}</td>
			<td class="right">${this.user.threadId}</td>
			<td class="left">${this.user.server}</td>
			<td class="left">${this.user.mainName}</td>
			<td class="center">${new Date(this.user.loginTime).toLocaleString()}</td>
			<td class="center">${this.user.elapsedTime}</td>
			<td class="right">${this.user.totalInstrCount}</td>
			<td class="right">${this.user.instrCountPerSec}</td>
			<td class="left">${this.user.remark}</td>
			<td class="right">${this.user.memUsed}</td>
			<td class="right">${this.user.sid}</td>
			<td class="right">${this.user.ctreeTaskId}</td>
			<td class="center">${this.user.inactiveTime}</td>
			<td class="left">${this.user.clientType}</td>
        `;
	}

	onCheckBoxChanged(event: Event) {
		if ((event.target as MonitorCheckbox).checked) {
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


