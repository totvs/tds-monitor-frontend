import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-add-server-dialog.css';
import { MonitorTextInput } from './monitor-text-input';
import { MonitorDialog } from './monitor-dialog';

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

		this.innerHTML = html`
			<monitor-text-input id="name" tabindex="1" type="text" label="Nome"></monitor-text-input>
			<monitor-text-input id="address" tabindex="2" type="text" label="Endereço"></monitor-text-input>
			<monitor-text-input id="port" tabindex="3" type="number" label="Porta"></monitor-text-input>
		`.getHTML();

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

	/*
render() {
	return html`
		<dialog>
			<header>${this.title}</header>
			<main>
				<slot></slot>
			</main>
			<footer>
				<button id="ok" type="button" @click="${this.onOkButtonClicked}">Ok</button>
				<!--Save-->
				<button id="cancel" type="button" value="Save and Close" @click="${this.onCancelButtonClicked}">Cancel</button>
			</footer>
		</dialog>
	`;

				<div class="mainContainer">
				<div class="formWrap" style="background-image: none;">

					<form class="formServer" name="form_server" id="form_server">
						<div class="logo">
							<span class="formTitle">New Server</span><!--New Server-->
						</div>

						<div class="wrap-input">
							<input class="inputText input-serverName" type="text" id="nameID" name="serverName" placeholder="Server Name" required> <!--Server Name-->
							<span class="focus-input fi-serverName">
							</span>
						</div>

						<div class="wrap-input">
							<input class="inputText input-address" type="text" id="addressID" name="address" placeholder="Address" required>  <!--Address-->
							<span class="focus-input fi-address">
							</span>
						</div>

						<div class="wrap-input">
							<input class="inputText input-port" type="number" id="portID" name="port" pattern="[0-9]{5}" placeholder="Port" required> <!--Port-->
							<span class="focus-input fi-port">
							</span>
						</div>

						<div class="wrap-submit">
							<button class="btn-submit" id="submitID" type="button" value="Save" @click="${this.onSaveClicked}">Save</button> <!--Save-->
							<button class="btn-submit" id="submitID" type="button" value="Save and Close" @click="${this.onSaveCloseClicked}">Save and Close</button> <!--Save/Close-->
						</div>
					</form>
				</div>
				</div>
				</dialog>
			`;
}
			*/

	onOkButtonClicked(event: Event) {
		let serverName = this.querySelector<MonitorTextInput>('#name');
		let address = this.querySelector<MonitorTextInput>('#address');
		let port = this.querySelector<MonitorTextInput>('#port');

		let newServer: Server = {
			name: serverName.value,
			address: address.value,
			port: Number(port.value)
		};

		const app = document.querySelector('monitor-app');
		app.addServer(newServer);

		console.log(app.settings)

		this.close();
	}

	onCancelButtonClicked(event: Event) {
		console.log(event);
		this.close();
	}

}

