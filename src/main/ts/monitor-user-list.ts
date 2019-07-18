import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property, query } from 'lit-element';
import { style } from '../css/monitor-user-list.css';
import { MonitorButton } from './monitor-button';
import { MonitorSendMessageDialog } from './monitor-send-message-dialog';
import { MonitorUserListRow } from './monitor-user-list-row';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list': MonitorUserList;
	}
}

@customElement('monitor-user-list')
export class MonitorUserList extends LitElement {

	@query('monitor-button[icon="chat"]')
	sendMessageButton: MonitorButton;

	@property({ type: Object })
	set server(value: TdsMonitorServer) {
		let oldValue = this._server;
		this._server = value;

		this.server.getUsers()
			.then((users) => this.users = users);

		this.requestUpdate('server', oldValue);
	}
	get server(): TdsMonitorServer {
		return this._server;
	}
	_server: TdsMonitorServer = null;

	@property({ type: Array })
	get users(): MonitorUser[] {
		return this._users;
	};
	set users(newValue: MonitorUser[]) {
		let oldValue = this._users;

		this._users = newValue;
		this._rows = this.users.map(user => {
			let row = new MonitorUserListRow(user);
			row.onchange = (event) => this.onCheckBoxChanged(event);
			return row;
		});

		this.requestUpdate('userSelected', oldValue);
	}

	_users: MonitorUser[];
	_rows: MonitorUserListRow[];

	@property({ type: Boolean })
	get userSelected(): boolean {
		return (this.renderRoot.querySelectorAll('monitor-user-list-row[checked]').length > 0);
	}

	static get styles(): CSSResult {
		return style;
	}

	//<mwc-icon-button icon="not_interested">
	//<mwc-icon-button icon="check_box_outline_blank"></mwc-icon-button>
	//<mwc-icon-button icon="arrow_drop_down"></mwc-icon-button>

	render() {
		return html`
			<div>
				<header>
					<monitor-button small icon="check_box_outline_blank"></monitor-button>
					<monitor-button small icon="arrow_drop_down"></monitor-button>
					<monitor-button icon="chat" @click="${this.onButtonSendMessageClick}" ?disabled=${!this.userSelected} title="Enviar Mensagem">
						Enviar Mensagem
					</monitor-button>
					<monitor-button icon="power_off" @click="${this.onButtonAppKillUserClick}" ?disabled=${!this.userSelected} title="Desconectar">
						Desconectar
					</monitor-button>
					<monitor-button icon="power_off" @click="${this.onButtonKillUserClick}" ?disabled=${!this.userSelected} title="Desconectar Imediatamente">
						Desconectar Imediatamente
					</monitor-button>
					<!--
					<monitor-text-input outlined icon="search"></monitor-text-input>
					<monitor-button title="Desabilitar novas conexões" icon="not_interested">Desabilitar novas conexões</monitor-button>
					-->
				</header>

				<table>
					<thead>
						<tr>
							<th></th>
							<th>User Name</th>
							<th>Environment</th>
							<th>Machine</th>
							<th>Thread ID</th>
							<th>User In Server</th>
							<th>Program</th>
							<th>Connected</th>
							<th>Elapsed Time</th>
							<th>Instructions</th>
							<th>Instructions/Seconds</th>
							<th>Comments</th>
							<th>Memory</th>
							<th>SID</th>
							<th>RPO</th>
							<th>Inactive Time</th>
							<th>Connection Type</th>
						</tr>
					</thead>

					<tbody>
						${this._rows}
					</tbody>
				</table>
			</div>
        `;
	}

	onCheckBoxChanged(event: Event) {
		this.requestUpdate('userSelected');
	}

	onButtonSendMessageClick(event: MouseEvent) {
		let users = this._rows
			.filter((row) => row.checked)
			.map((row) => row.user);


		let dialog = new MonitorSendMessageDialog(this.server, users);
		dialog.show();
	}

	onButtonKillUserClick(event: MouseEvent) {
		this._rows
			.filter((row) => row.checked)
			.forEach((row) => {
			//console.log(row.user.username + " :: " + row.user.computerName + " :: " + row.user.threadId + " :: " + row.user.server);
			this.server.killUser(row.user.username, row.user.computerName, row.user.threadId, row.user.server);
		})
	}

	onButtonAppKillUserClick(event: MouseEvent) {
		this._rows
			.filter((row) => row.checked)
			.forEach((row) => {
			//console.log(row.user.username + " :: " + row.user.computerName + " :: " + row.user.threadId + " :: " + row.user.server);
			this.server.appKillUser(row.user.username, row.user.computerName, row.user.threadId, row.user.server);
		})
	}
}


