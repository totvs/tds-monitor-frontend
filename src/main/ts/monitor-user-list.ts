import { LitElement, html, customElement, CSSResult, property } from 'lit-element';
import { MonitorUser } from '@totvs/tds-languageclient';
import { style } from '../css/monitor-user-list.css';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list': MonitorUserList;
	}
}

declare type MonitorUserListStatus = 'iddle' | 'connecting' | 'connected' | 'error';

@customElement('monitor-user-list')
export class MonitorUserList extends LitElement {

	@property({ type: Array })
	users: MonitorUser[] = [];

	@property({ type: String })
	name: string = '';

	@property({ type: String })
	error: string = '';

	@property({ type: String })
	status: MonitorUserListStatus = 'iddle';

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<div class="${this.status}">
				<span class='connecting-message'>Conectando ao servidor ${this.name}</span>
				<span class='error-message'>${this.error}</span>
				<table>
					<thead>
						<tr>
							<th>User Name</th>
							<th>Environment</th>
							<th>Machine</th>
							<th>Thread ID</th>
							<th>User In Server</th>
							<th>Program</th>
							<th>Connected</th>
							<th>Elapsed Time</th>
							<th>Instructions</th>
							<th>Instrctions/Seconds</th>
							<th>Comments</th>
							<th>Memory</th>
							<th>SID</th>
							<th>RPO</th>
							<th>Inactive Time</th>
							<th>Connection Type</th>
						</tr>
					</thead>

					<tbody>
						${this.users.map(user => html`
						<tr>
							<td>${user.username}</td>
							<td>${user.environment}</td>
							<td>${user.computerName}</td>
							<td class="right">${user.threadId}</td>
							<td>${user.server}</td>
							<td>${user.mainName}</td>
							<td>${user.loginTime}</td>
							<td>${user.elapsedTime}</td>
							<td class="right">${user.totalInstrCount}</td>
							<td class="right">${user.instrCountPerSec}</td>
							<td>${user.remark}</td>
							<td class="right">${user.memUsed}</td>
							<td class="right">${user.sid}</td>
							<td class="right">${user.ctreeTaskId}</td>
							<td class="center">${user.inactiveTime}</td>
							<td>${user.clientType}</td>
						</tr>
						`)}
					</tbody>
				</table>
			</div>
        `;
	}

}


