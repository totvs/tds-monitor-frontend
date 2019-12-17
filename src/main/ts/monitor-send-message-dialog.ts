import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, property } from 'lit-element';
import { style } from '../css/monitor-send-message-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorDialog, ProgressOption } from './monitor-dialog';
import { MonitorTextInput } from './monitor-text-input';

@customElement('monitor-send-message-dialog')
export class MonitorSendMessageDialog extends MonitorDialog {

	get message(): string {
		return this.renderRoot.querySelector<MonitorTextInput>('#message').value;
	}

	@property({ type: String, reflect: true, attribute: true })
	get progress(): ProgressOption {
		return super.progress;
	}
	set progress(value: ProgressOption) {
		super.progress = value;
	}

	server: TdsMonitorServer;
	users: Array<MonitorUser>;

	constructor(server: TdsMonitorServer, users: Array<MonitorUser>) {
		super({
			escClose: true,
			buttons: [
				{
					text: 'Enviar',
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: 'Cancelar',
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = 'Enviar Mensagem';
		this.progress = 'hidden';
		this.server = server;
		this.users = users;
	}

	get body() {
		return html`
			<monitor-text-input id="message" tabindex="1" type="textarea"></monitor-text-input>
		`;
	}


	static get styles(): CSSResult {
		return style;
	}

	blockControls(block: boolean) {
		this.renderRoot.querySelectorAll<MonitorTextInput>('monitor-text-input')
			.forEach((element => {
				element.disabled = block;
			}));

		this.renderRoot.querySelectorAll<MonitorButton>('monitor-button')
			.forEach((element => {
				element.disabled = block;
			}));
	}

	onOkButtonClicked(event: Event) {
		this.blockControls(true);
		this.progress = 'visible';

		//Validar inputs aqui
		if (this.message.length == 0) {
			// alert ou outro modal com o erro ???
			return;
		}

		let progressbar = this.renderRoot.querySelector('monitor-linear-progress'),
			step = 1 / this.users.length;

		progressbar.indeterminate = false;
		progressbar.progress = 0;

		this.users.forEach((user) => {
			//console.log(user.username + " :: " + user.computerName + " :: " + user.threadId + " :: " + user.server + " :: " + this.message);
			this.server.sendUserMessage(user.username, user.computerName, user.threadId, user.server, this.message);

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

