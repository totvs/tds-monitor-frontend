import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-add-server-dialog.css';
import { MonitorTextInput } from './monitor-text-input';
import { MonitorDialog } from './monitor-dialog';
import { MonitorButton } from './monitor-button';

@customElement('monitor-add-server-dialog')
export class MonitorAddServerDialog extends MonitorDialog {

	constructor() {
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

		this.title = 'Adicionar Novo Servidor';
		this.progress = 'hidden';

		this.innerHTML = html`
			<monitor-text-input id="name" tabindex="1" type="text" label="Nome"></monitor-text-input>
			<monitor-text-input id="address" tabindex="2" type="text" label="Endereço"></monitor-text-input>
			<monitor-text-input id="port" tabindex="3" type="number" label="Porta"></monitor-text-input>
		`.getHTML();
	}

	static get styles(): CSSResult {
		return style;
	}

	blockControls(block: boolean) {
		this.querySelectorAll<MonitorTextInput>('monitor-text-input')
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

		const name = this.querySelector<MonitorTextInput>('#name').value,
			address = this.querySelector<MonitorTextInput>('#address').value,
			port = Number(this.querySelector<MonitorTextInput>('#port').value),
			newServer = languageClient.createMonitorServer();

		newServer.address = address;
		newServer.port = port;

		this.progress = 'visible';

		newServer.validate()
			.then((valid: boolean) => {
				this.progress = 'hidden';
				this.blockControls(false);

				if (!valid) {
					throw new Error('server.validate failed!');
				}

				const app = document.querySelector('monitor-app');

				app.addServer({
					name: name,
					server: newServer
				});

				this.close();
			})
			.catch((error: Error) => {
				console.error(error);

				this.progress = 'hidden';
				this.blockControls(false);
			});
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}

