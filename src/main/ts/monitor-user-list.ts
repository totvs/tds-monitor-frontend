import { LitElement, html, css, customElement, CSSResult, property } from 'lit-element';
import { MonitorUser } from '@totvs/tds-languageclient';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list': MonitorUserList;
	}
}

@customElement('monitor-user-list')
export class MonitorUserList extends LitElement {

	@property({ type: Array })
	users: MonitorUser[] = [];

	@property({ type: String })
	name: string = '';

	@property({ type: String })
	error: string = '';

	@property({ type: Boolean })
	status: 'iddle' | 'connecting' | 'connected' | 'error' = 'iddle';

	static get styles(): CSSResult {
		return css`
            :host {
				overflow: hidden;
                flex-grow: 1;
                display: flex;
			}

			div {
				overflow: auto;
				padding: 30px;
				height: 100%;
				width: 100%;
			}

			.iddle .error-message, .iddle .connecting-message, .iddle table  {
				display: none;
			}


			.connecting .error-message, .connecting table  {
				display: none;
			}

			.connected .error-message, .connected .connecting-message  {
				display: none;
			}

			.error .connecting-message, .error table {
				display: none;
			}

			table {
				border-collapse: collapse;
				border-spacing: 0;
			}

			thead {
				color: rgba(0,0,0,0.6);
			}

			th, td {
				white-space: nowrap;
				padding: 15px 10px;
			}

			td.center {
				text-align: center;
			}

			td.right {
				text-align: right;
			}

			tr {
				border-bottom: 1px solid rgba(0,0,0,0.12);
			}
        `;
	}

	render() {
		return html`
			<div class="${this.status}">
				<span class='connecting-message'>Connectando ao servidor ${this.name}</span>
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


