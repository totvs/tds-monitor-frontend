import { LitElement, html, customElement, CSSResult, property, query } from 'lit-element';
import { MonitorUser } from '@totvs/tds-languageclient';
import { style } from '../css/monitor-user-list.css';
import { MonitorButton } from './monitor-button';
import { MonitorUserListRow } from './monitor-user-list-row';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list': MonitorUserList;
	}
}

export type MonitorUserListStatus = 'iddle' | 'connecting' | 'connected' | 'error';

@customElement('monitor-user-list')
export class MonitorUserList extends LitElement {


	@query('monitor-button[icon="chat"]')
	sendMessageButton: MonitorButton;

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

	@property({ type: String })
	name: string = '';

	@property({ type: String })
	error: string = '';

	@property({ type: String })
	status: MonitorUserListStatus = 'iddle';

	@property({ type: Boolean })
	get userSelected(): boolean {
		return (this.renderRoot.querySelectorAll('monitor-user-list-row[checked]').length > 0);
	}

	static get styles(): CSSResult {
		return style;
	}

	//<mwc-icon-button icon="not_interested">


	render() {
		return html`
			<div class="${this.status}">
				<header>
					<monitor-button icon="check_box_outline_blank"></monitor-button>
					<monitor-button @click="${this.onButtonSendMessageClick}" ?disabled=${!this.userSelected} title="Enviar Mensagem"
					 icon="chat">Enviar Mensagem</monitor-button>
					<monitor-button ?disabled=${!this.userSelected} title="Desconectar" icon="power_off">Desconectar</monitor-button>
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
		/*
		this.renderRoot.querySelectorAll('monitor-checkbox[checked]').forEach(() => {
			this.server.
		})
		*/
	}
}


