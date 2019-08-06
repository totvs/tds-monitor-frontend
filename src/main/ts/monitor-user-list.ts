import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property, query } from 'lit-element';
import { style } from '../css/monitor-user-list.css';
import { MonitorButton } from './monitor-button';
import { MonitorKillUserDialog } from './monitor-kill-user-dialog';
import { MonitorOtherActionsDialog } from './monitor-other-actions-dialog';
import { MonitorSelfRefreshDialog } from './monitor-self-refresh-dialog';
import { MonitorSendMessageDialog } from './monitor-send-message-dialog';
import { MonitorUserListRow } from './monitor-user-list-row';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list': MonitorUserList;
	}
}

interface MonitorUserRow extends MonitorUser {
	checked: boolean;
}

@customElement('monitor-user-list')
export class MonitorUserList extends LitElement {

	@query('monitor-button[icon="chat"]')
	sendMessageButton: MonitorButton;

	@property({ type: Object })
	set server(value: TdsMonitorServer) {
		let oldValue = this._server;
		this._server = value;

		if (this.server.token !== null) {
			this.server.getUsers()
				.then((users) => this.users = users);
		}

		this.requestUpdate('server', oldValue);
	}
	get server(): TdsMonitorServer {
		return this._server;
	}
	_server: TdsMonitorServer = null;
	_connectionStatus: boolean = false;
	_footerConnectedUser: string;
	_footerUpdateInterval: string;
	_footerLastUpdate: string;


	query: RegExp = null;

	@property({ type: Array })
	get users(): MonitorUser[] {
		const users = Array.from(this._users.values())

		if (this.query !== null)
			return users.filter((user) => findInSearch(user, this.query));

		return users;
	};
	set users(newValue: MonitorUser[]) {
		let oldValue = this._users;
		const newMap = new Map<string, MonitorUserRow>();


		newValue.forEach((user: MonitorUser) => {
			const key = `${user.username}${user.computerName}${user.threadId}${user.server}`;

			if (this._users.has(key)) {
				const oldUser = this._users.get(key);

				newMap.set(key, Object.assign({}, oldUser, user));
			}
			else {
				newMap.set(key, Object.assign({ checked: false}, user));
			}
		});

		this._users.clear();
		this._users = newMap;

		/*
		this._rows = this.users.map((user) => {
			let row = new MonitorUserListRow(user),
				oldRow = this._rows.find(row => sameUser(row.user, user));

			row.onchange = (event) => this.onCheckBoxChanged(event);

			if (oldRow) {
				oldRow.onchange = null;

				row.checked = oldRow.checked;
				row.visible = oldRow.visible;
			}

			return row;
		});
		*/

		this.requestUpdate('userSelected', oldValue);

		var lastUpdate = new Date().toLocaleDateString(undefined, {
			month: '2-digit',
			day: '2-digit',
			year: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit'
		});
		const app = document.querySelector('monitor-app');
		this._footerConnectedUser = (this.users.length > 0 ? this.users.length : 'Nenhum') + " usuário" + (this.users.length > 1 ? "s" : "") + " conectado" + (this.users.length > 1 ? "s" : "");
		this._footerUpdateInterval = "Intervalo para auto atualização: " + (app.config.updateInterval > 0 ? (app.config.updateInterval + " segundos") : "Desativado");
		this._footerLastUpdate = "Atualizado em: " + lastUpdate;
	}

	get rows(): Array<MonitorUserListRow> {
		return Array.from(this.renderRoot.querySelectorAll('monitor-user-list-row'));
	}

	_users: Map<string, MonitorUserRow> = new Map();
	_searchHandle: number = null;

	@property({ type: Boolean })
	get userSelected(): boolean {
		return (this.renderRoot.querySelectorAll('monitor-user-list-row[checked]').length > 0);
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<header>
				<monitor-button small icon="${this.checkAllIcon}" @click="${this.onButtonCheckAllClick}"></monitor-button>
				<monitor-button small icon="arrow_drop_down" title="Seleção"></monitor-button>
				&nbsp;
				&nbsp;
				<monitor-button small icon="refresh" @click="${this.onRefresh}" title="Atualizar"></monitor-button>
				&nbsp;
				&nbsp;
				<monitor-button small icon="update" @click="${this.onSelfRefresh}" title="Auto atualizar"></monitor-button>
				<!-- monitor-button small icon="arrow_drop_down" title="Intervalo de auto atualizar"></monitor-button -->
				&nbsp;
				&nbsp;
				<monitor-button small icon="chat" @click="${this.onButtonSendMessageClick}" ?disabled=${!this.userSelected} title="Enviar Mensagem"></monitor-button>
				&nbsp;
				&nbsp;
				<monitor-button small icon="power_off" @click="${this.onButtonKillUserDialogClick}" ?disabled=${!this.userSelected}
				 title="Desconectar"></monitor-button>
				&nbsp;
				&nbsp;
				<monitor-text-input outlined icon="search" @change="${this.onSearchChanged}" @input="${this.onSearchInput}"></monitor-text-input>
				&nbsp;
				&nbsp;
				<monitor-button small icon="more_vert" @click="${this.onButtonOtherActionsClick}" title="Outras ações"></monitor-button>
				<!--
							<monitor-button title="Desabilitar novas conexões" icon="not_interested">Desabilitar novas conexões</monitor-button>
							-->
			</header>

			<div>
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
							<th>Instruc.</th>
							<th>Instruc./Sec</th>
							<th>Comments</th>
							<th>Memory</th>
							<th>SID</th>
							<th>RPO</th>
							<th>Inactive Time</th>
							<th>Connection Type</th>
						</tr>
					</thead>

					<tbody>
						${this.users.map((user: MonitorUserRow) => {
							return html`
								<monitor-user-list-row
									@change="${this.onCheckBoxChanged}"
									?checked=${user.checked}

									username="${user.username}"
									environment="${user.environment}"
									computerName="${user.computerName}"
									threadId="${user.threadId}"
									server="${user.server}"
									mainName="${user.mainName}"
									loginTime="${user.loginTime}"
									elapsedTime="${user.elapsedTime}"
									totalInstrCount="${user.totalInstrCount}"
									instrCountPerSec="${user.instrCountPerSec}"
									remark="${user.remark}"
									memUsed="${user.memUsed}"
									sid="${user.sid}"
									ctreeTaskId="${user.ctreeTaskId}"
									inactiveTime="${user.inactiveTime}"
									clientType="${user.clientType}">
								</monitor-user-list-row>
							`;
						})}
					</tbody>
				</table>
			</div>

			<footer>
				<span class="footer">${this._footerConnectedUser}</span>
				-
				<span class="footer">${this._footerUpdateInterval}</span>
				-
				<span class="footer">${this._footerLastUpdate}</span>
			</footer>
        `;
	}

	onSearchChanged(event: Event) {
		console.log('changed', event);
	}

	onSearchInput(event: Event) {
		if (this._searchHandle !== null) {
			//console.log('canceling animation frame')

			window.clearTimeout(this._searchHandle);
			this._searchHandle = null;
		}

		this._searchHandle = window.setTimeout(() => {
			this._searchHandle = null;

			const text = this.renderRoot.querySelector('monitor-text-input').value;

			if (text.trim() === '') {
				this.query = null;
			}
			else {
				this.query = new RegExp(text, 'i');
			}

			this.requestUpdate('users');
		}, 300);
	}

	onRefresh(event: Event) {
		if (this.server) {
			this.server.getUsers()
				.then(users => this.users = users);
		}
	}

	onSelfRefresh(event: Event) {
		let dialog = new MonitorSelfRefreshDialog();
		dialog.show();
	}

	onCheckBoxChanged(event: Event) {
		const row = event.target as MonitorUserListRow,
			key = `${row.username}${row.computerName}${row.threadId}${row.server}`;

		this._users.get(key).checked = row.checked;

		this.requestUpdate('userSelected');
	}

	onButtonSendMessageClick(event: MouseEvent) {
		const users = this.users
			.filter((row: MonitorUserRow) => row.checked);

		const dialog = new MonitorSendMessageDialog(this.server, users);
		dialog.show();
	}

	onButtonKillUserDialogClick(event: MouseEvent) {
		const users = this.users
			.filter((row: MonitorUserRow) => row.checked);

		const dialog = new MonitorKillUserDialog(this.server, users);
		dialog.show();
	}

	onButtonCheckAllClick(event: MouseEvent) {
		const check = !this.rows.some((row) => row.checked);

		this.rows.forEach(row => row.visible ? row.checked = check : false);

		this.requestUpdate('checkAllIcon');
	}

	async onButtonOtherActionsClick(event: MouseEvent) {
		await this.server.getConnectionStatus()
			.then((status: boolean) => this._connectionStatus = status);

		let dialog = new MonitorOtherActionsDialog(this.server, this._connectionStatus);
		dialog.show();
	}

	@property({ type: String })
	get checkAllIcon(): string {
		const rows = this.rows,
			every = rows.every(row => row.checked),
			none = !rows.some(row => row.checked);

		if (none) {
			return 'check_box_outline_blank'
		}
		else if (every) {
			return 'check_box';
		}
		else {
			return 'indeterminate_check_box';
		}
	}

}

const findInSearch = (user: MonitorUser, query: RegExp) => {
	return Object.keys(user)
		.some((key: keyof MonitorUser) => query.test(user[key].toString()))
}
