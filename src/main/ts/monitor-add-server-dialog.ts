import { MonitorWarning } from './monitor-warning';
import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-add-server-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorDialog } from './monitor-dialog';
import { MonitorTextInput } from './monitor-text-input';

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
		/*


				let inputName = new MonitorTextInput();
				inputName.id = 'name'
				inputName.label = 'Nome';
				inputName.tabIndex = 1;

				let inputAddress = new MonitorTextInput();
				inputAddress.id = 'address';
				inputAddress.label = 'Endereço';
				inputAddress.tabIndex = 2;

				new HTMLDivElement();

				let inputPort = new MonitorTextInput();
				inputPort.id = 'port';
				inputPort.type = 'number';
				inputPort.label = 'Porta';
				inputPort.tabIndex = 3;
				*/

		/*
		let inputEnv = new MonitorTextInput();
		inputEnv.label = 'Ambiente';

		let inputUsername = new MonitorTextInput();
		inputUsername.label = 'Usuário';

		let inputPassword = new MonitorTextInput();
		inputPassword.label = 'Senha';
		*/


		/*
		this.appendChild(inputName);
		this.appendChild(inputAddress);
		this.appendChild(inputPort);

		this.appendChild(inputEnv);
		this.appendChild(inputUsername);
		this.appendChild(inputPassword);
		*/
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<monitor-warning id='showError' msg='' showError='no'></monitor-warning>
			<monitor-text-input id="name" tabindex="1" type="text" label="Nome"></monitor-text-input>
			<monitor-text-input id="address" tabindex="2" type="text" label="Endereço"></monitor-text-input>
			<monitor-text-input id="port" tabindex="3" type="number" min="1" label="Porta"></monitor-text-input>
		`;
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

		const name = this.renderRoot.querySelector<MonitorTextInput>('#name').value,
			address = this.renderRoot.querySelector<MonitorTextInput>('#address').value,
			port = Number(this.renderRoot.querySelector<MonitorTextInput>('#port').value),
			newServer = languageClient.createMonitorServer();

		if (!name) {
			this.progress = 'hidden';
			this.blockControls(false);
			this.focus()
			this.renderRoot.querySelector<MonitorWarning>('#showError').showTheError("Nome de servidor Inválido !");
			this.renderRoot.querySelector<MonitorTextInput>('#name').showRedLine('Nome de Servidor Inválido', 'text');

		}
		else if (!address) {
			this.progress = 'hidden';
			this.blockControls(false);
			this.focus()
			this.renderRoot.querySelector<MonitorWarning>('#showError').showTheError("Endereço do servidor Inválido !");
			this.renderRoot.querySelector<MonitorTextInput>('#address').showRedLine('Endereço Inválido', 'text');
		}
		else if (!port) {
			this.progress = 'hidden';
			this.blockControls(false);
			this.focus()
			this.renderRoot.querySelector<MonitorWarning>('#showError').showTheError("Porta do servidor Inválida !");
			this.renderRoot.querySelector<MonitorTextInput>('#port').showRedLine('Porta Inválida', 'number');
		}
		else {

			const listOfServers = JSON.parse(window.localStorage.getItem('settings'));
			let cantStoreValue = listOfServers.servers.filter(item => {
				return ((item.address == address && item.port == port) || item.name == name)
			});

			if (cantStoreValue.length > 0) {
				this.progress = 'hidden';
				this.blockControls(false);
				this.focus()
				this.renderRoot.querySelector<MonitorWarning>('#showError').showTheError("Dados de servidor já cadastrados !");
			}
			else {

				this.blockControls(true);

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

		}
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}

