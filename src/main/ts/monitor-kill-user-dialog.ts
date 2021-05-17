import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-kill-user-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { MonitorButton } from './monitor-button';
import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { MonitorRadio } from './monitor-radio';
import { i18n } from './util/i18n';

@customElement('monitor-kill-user-dialog')
export class MonitorKillUserDialog extends MonitorDialog {

	server: TdsMonitorServer;
	users: Array<MonitorUser>;

	constructor(server: TdsMonitorServer, users: Array<MonitorUser>) {
		super({
			escClose: true,
			buttons: [
				{
					text: i18n.ok(),
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: i18n.cancel(),
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = i18n.localize("DISCONNECT_USERS", "Disconnect Users");

		this.server = server;
		this.users = users;
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<label @click="${this.onLabelClick}">
				<monitor-radio id="killUser" checked tabindex="1" name="killUserType" title="${i18n.localize("IMMEDIATE_TERMINATION", "Immediate termination")}"></monitor-radio>
				<span>${i18n.localize("IMMEDIATE_TERMINATION", "Immediate termination")}</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio id="appKillUser" tabindex="2" name="killUserType" title="${i18n.localize("WAIT_APPLICATION", "Wait for application")}"></monitor-radio>
				<span>${i18n.localize("WAIT_APPLICATION", "Wait for application")}</span>
			</label>
		`;
	}

	onLabelClick(event: MouseEvent) {
		let label = event.currentTarget as HTMLLabelElement,
			radio = label.querySelector<MonitorRadio>('monitor-radio');

		this.renderRoot.querySelectorAll<MonitorRadio>('monitor-radio')
			.forEach((radio: MonitorRadio) => radio.checked = false);

		radio.checked = true;
	}


	blockControls(block: boolean) {
		this.renderRoot.querySelectorAll<MonitorRadio>('monitor-radio')
			.forEach((element: MonitorRadio) => {
				element.disabled = block;
			});

		this.renderRoot.querySelectorAll<MonitorButton>('monitor-button')
			.forEach((element: MonitorButton) => {
				element.disabled = block;
			});
	}

	onOkButtonClicked(event: Event) {
		this.blockControls(true);
		this.progress = 'visible';

		let appKillUser = this.renderRoot.querySelector<MonitorRadio>('monitor-radio#appKillUser'),
			progressbar = this.renderRoot.querySelector('monitor-linear-progress'),
			step = 1 / this.users.length;

		progressbar.indeterminate = false;
		progressbar.progress = 0;

		this.users.forEach((user) => {
			//console.log(user.username + " :: " + user.computerName + " :: " + user.threadId + " :: " + user.server + " :: " + this.message);
			if (appKillUser.checked)
				this.server.appKillUser(user.username, user.computerName, user.threadId, user.server, user.environment);
			else
				this.server.killUser(user.username, user.computerName, user.threadId, user.server, user.environment);

			progressbar.progress += step;
		})

		this.blockControls(false);
		this.progress = 'hidden';
		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
