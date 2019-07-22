import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-kill-user-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { MonitorButton } from './monitor-button';
import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { MonitorRadio } from './monitor-radio';

@customElement('monitor-kill-user-dialog')
export class MonitorKillUserDialog extends MonitorDialog {

	server: TdsMonitorServer;
	users: Array<MonitorUser>;

	constructor(server: TdsMonitorServer, users: Array<MonitorUser>) {
		super({
			escClose: true,
			buttons: [
				{
					text: 'Ok',
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: 'Cancel',
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = 'Desconectar Usuário';

		this.server = server;
		this.users = users;

		this.innerHTML = html`
			<label>
				<monitor-radio id="killUser" tabindex="1" name="killUserType" title="Finalização imediata"></monitor-radio>
				<span>Finalização imediata</span>
			</label>
			<label>
				<monitor-radio id="appKillUser" tabindex="2" name="killUserType" title="Aguardar pela aplicação"></monitor-radio>
				<span>Aguardar pela aplicação</span>
			</label>
		`.getHTML();
	}

	static get styles(): CSSResult {
		return style;
	}

	blockControls(block: boolean) {
		// this.querySelectorAll<MonitorRadio>('monitor-radio')
		// 	.forEach((element => {
		// 		element.disabled = block;
		// 	}));

		this.renderRoot.querySelectorAll<MonitorButton>('monitor-button')
			.forEach((element => {
				element.disabled = block;
			}));
	}

	onOkButtonClicked(event: Event) {
		//Validar inputs aqui
		if (!(document.getElementById('appKillUser') as MonitorRadio).checked && !(document.getElementById('killUser') as MonitorRadio).checked) {
			// alert ou outro modal com o erro ???
			return;
		}

		this.blockControls(true);
		this.progress = 'visible';

		let progressbar = this.renderRoot.querySelector('monitor-linear-progress'),
			step = 1 / this.users.length;

		progressbar.determinate = true;
		progressbar.progress = 0;

		this.users.forEach((user) => {
			//console.log(user.username + " :: " + user.computerName + " :: " + user.threadId + " :: " + user.server + " :: " + this.message);
			if ((document.getElementById('appKillUser') as MonitorRadio).checked)
				this.server.appKillUser(user.username, user.computerName, user.threadId, user.server);
			else if ((document.getElementById('killUser') as MonitorRadio).checked)
				this.server.killUser(user.username, user.computerName, user.threadId, user.server);

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
