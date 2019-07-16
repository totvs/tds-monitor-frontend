import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-authentication-dialog.css';
import { MonitorTextInput } from './monitor-text-input';
import { MonitorDialog } from './monitor-dialog';
import { MonitorButton } from './monitor-button';
import { MonitorServerItem } from './monitor-server-item';

@customElement('monitor-authentication-dialog')
export class MonitorAuthenticationDialog extends MonitorDialog {

	monitorServerItem: MonitorServerItem;

	constructor(monitorServerItem: MonitorServerItem) {
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

		this.monitorServerItem = monitorServerItem;

		this.title = 'Autenticar Conexão';
		this.progress = 'hidden';

		this.innerHTML = html`
			<monitor-text-input id="environment" tabindex="1" type="text" label="Ambiente"></monitor-text-input>
			<monitor-text-input id="user" tabindex="2" type="text" label="Usuário"></monitor-text-input>
			<monitor-text-input id="password" tabindex="3" type="password" label="Senha"></monitor-text-input>
		`.getHTML();
	}

	static get styles(): CSSResult {
		return style;
	}

	blockControls(block: boolean) {
		this.querySelectorAll<MonitorTextInput>('monitor-text-input')
			.forEach((element => {
				element.disabled = block;
				//element.requestUpdate();
			}));

		this.renderRoot.querySelectorAll<MonitorButton>('monitor-button')
			.forEach((element => {
				element.disabled = block;
				//element.requestUpdate();
			}));

		//this.requestUpdate();
	}

	onOkButtonClicked(event: Event) {
		console.log('onOkButtonClicked');

		this.blockControls(true);

		const environment = this.querySelector<MonitorTextInput>('#environment').value,
		 	user = this.querySelector<MonitorTextInput>('#user').value,
		 	password = this.querySelector<MonitorTextInput>('#password').value;
		// 	monitorServer = languageClient.getMonitorServer();

		this.monitorServerItem.environment = environment;
		this.monitorServerItem.user = user;
		this.monitorServerItem.password = password;

		this.progress = 'visible';

		// newServer.validate()
		// 	.then((valid: boolean) => {
		// 		this.progress = 'hidden';
		// 		this.blockControls(false);

		// 		if (!valid) {
		// 			throw new Error('server.validate failed!');
		// 		}

		// 		const app = document.querySelector('monitor-app');

		// 		app.addServer({
		// 			name: name,
		// 			server: newServer
		// 		});

		 		this.close();
		// 	})
		// 	.catch((error: Error) => {
		// 		console.error(error);

		// 		this.progress = 'hidden';
		// 		this.blockControls(false);
		// 	});
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
