import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property, query } from 'lit-element';
import { style } from '../css/monitor-user-list.css';
import { MonitorButton } from './monitor-button';
import { MonitorSendMessageDialog } from './monitor-send-message-dialog';
import { MonitorUserListRow } from './monitor-user-list-row';
import { MonitorKillUserDialog } from './monitor-kill-user-dialog';
import { MonitorOtherActionsDialog } from './monitor-other-actions-dialog';
import { MonitorSelfRefreshDialog } from './monitor-self-refresh-dialog';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list': MonitorUserList;
	}
}

const sameUser = (a: MonitorUser, b: MonitorUser) => ['threadId', 'username', 'computerName', 'server'].every((key: keyof MonitorUser) => a[key] === b[key]);


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
	_footer: string;

	@property({ type: Array })
	get users(): MonitorUser[] {
		return this._users;
	};
	set users(newValue: MonitorUser[]) {
		let oldValue = this._users;

		this._users = newValue;
		this._rows = this.users.map((user) => {
			let row = new MonitorUserListRow(user),
				oldRow = this._rows.find(row => sameUser(row.user, user));

			row.onchange = (event) => this.onCheckBoxChanged(event);

			if (oldRow) {
				row.checked = oldRow.checked;
				row.visible = oldRow.visible;
			}

			return row;
		});

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
		this._footer = this.users.length + " usuário"+(this.users.length>1?"s":"") + " conectado" + (this.users.length>1?"s":"")
			+ " - Intervalo para auto atualização: " + (app.config.updateInterval > 0 ? (app.config.updateInterval + " segundos") : "desativado" )
			+ " - Atualizado em: " + lastUpdate;
	}

	_users: Array<MonitorUser> = [];
	_rows: Array<MonitorUserListRow> = [];
	_searchHandle: number = null;

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
				<monitor-button small icon="power_off" @click="${this.onButtonKillUserDialogClick}" ?disabled=${!this.userSelected} title="Desconectar"></monitor-button>
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
						${this._rows}
					</tbody>
				</table>
			</div>

			<footer>
				<span class="footer">${this._footer}</span>
			</footer>
        `;
	}

	onSearchChanged(event: Event) {
		console.log('changed', event);
	}

	onSearchInput(event: Event) {
		console.log('input', event);

		if (this._searchHandle !== null) {
			cancelAnimationFrame(this._searchHandle);
		}

		this._searchHandle = requestAnimationFrame(() => {
			this._searchHandle = null;
			const text = this.renderRoot.querySelector('monitor-text-input').value;

			if (text.trim() === '') {
				this._rows.every(row => {
					row.visible = true;
					return (this._searchHandle === null);
				});

				return;
			}

			const query = new RegExp(text, "i");

			this._rows.every(row => {
				row.visible = findInSearch(row.user, query);

				return (this._searchHandle === null);
			});

		});
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
		this.requestUpdate('userSelected');
	}

	onButtonSendMessageClick(event: MouseEvent) {
		let users = this._rows
			.filter((row) => row.checked)
			.map((row) => row.user);

		let dialog = new MonitorSendMessageDialog(this.server, users);
		dialog.show();
	}

	onButtonKillUserDialogClick(event: MouseEvent) {
		let users = this._rows
			.filter((row) => row.checked)
			.map((row) => row.user);

		let dialog = new MonitorKillUserDialog(this.server, users);
		dialog.show();
	}

	onButtonCheckAllClick(event: MouseEvent) {
		let check = !this._rows.some((row) => row.checked);

		this._rows.forEach(row => row.visible ? row.checked = check : false);

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
		let checkedRows = this._rows.filter((row) => row.checked).length;

		if (checkedRows === 0) {
			return 'check_box_outline_blank'
		}
		else if (checkedRows === this._rows.length) {
			return 'check_box';
		}
		else {
			return 'indeterminate_check_box';
		}

	}

}

const findInSearch = (user: MonitorUser, query: RegExp) =>  {
	return Object.keys(user)
		.some((key: keyof MonitorUser) => query.test(user[key].toString()))

		//.some((key: keyof MonitorUser) => user[key].toString().indexOf(query) > -1)
}

// const findInSearch = (user: MonitorUser, query: string) => ['username', 'computerName', 'server', 'server'].every((key: keyof MonitorUser) => a[key] === b[key]);
