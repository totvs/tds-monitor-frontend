import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property, query } from 'lit-element';
import { style } from '../css/monitor-user-list.css';
import { MonitorButton } from './monitor-button';
import { MonitorSendMessageDialog } from './monitor-send-message-dialog';
import { MonitorUserListRow } from './monitor-user-list-row';
import { MonitorKillUserDialog } from './monitor-kill-user-dialog';

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
				<monitor-button small icon="arrow_drop_down"></monitor-button>
				<monitor-button icon="chat" @click="${this.onButtonSendMessageClick}" ?disabled=${!this.userSelected} title="Enviar Mensagem">
					Enviar Mensagem
				</monitor-button>
				<monitor-button icon="power_off" @click="${this.onButtonKillUserDialogClick}" ?disabled=${!this.userSelected} title="Desconectar">
					Desconectar
				</monitor-button>
				<monitor-text-input outlined icon="search" @change="${this.onSearchChanged}" @input="${this.onSearchInput}"></monitor-text-input>
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
