import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-add-server-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorDialog } from './monitor-dialog';
import { MonitorTextInput } from './monitor-text-input';
import { MonitorWarning } from './monitor-warning';
import { MonitorRadio } from './monitor-radio';
import { i18n } from './util/i18n';

@customElement('monitor-add-server-dialog')
export class MonitorAddServerDialog extends MonitorDialog {

	constructor() {
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

		this.title = i18n.localize("ADD_NEW_SERVER", "Add New Server");
		this.progress = 'hidden';
	}

	static get styles(): CSSResult {
		return style;
	}

	get body(){
		return html`
			<monitor-warning id='show_error' msg='' showError='no' ></monitor-warning>
			<monitor-text-input id="name" tabindex="1" type="text" label="${i18n.localize("NAME", "Name")}" class="validate" ></monitor-text-input>
			<monitor-text-input id="address" tabindex="2" type="text" label="${i18n.localize("ADDRESS", "Address")}"></monitor-text-input>
			<monitor-text-input id="port" tabindex="3" type="number" min="1" label="${i18n.localize("PORT", "Port")}"></monitor-text-input>
			<label @click="${this.onLabelClick}">
				<monitor-radio id="serverType" value="1" checked tabindex="4" name="serverType" title="${i18n.protheus()}"></monitor-radio>
				<span>${i18n.protheus()}</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio id="serverType" value="2" tabindex="5" name="serverType" title="${i18n.logix()}"></monitor-radio>
				<span>${i18n.logix()}</span>
			</label>
		`;
	}

	blockControls(block: boolean) {
		this.renderRoot.querySelectorAll<MonitorTextInput>('monitor-text-input')
			.forEach((element => {
				element.disabled = block;
			}));

		this.renderRoot.querySelectorAll<MonitorRadio>('monitor-radio')
			.forEach((element => {
				element.disabled = block;
			}));

		this.renderRoot.querySelectorAll<MonitorButton>('monitor-button')
			.forEach((element => {
				element.disabled = block;
			}));
	}

	onLabelClick(event: MouseEvent) {
		let label = event.currentTarget as HTMLLabelElement,
			radio = label.querySelector<MonitorRadio>('monitor-radio');

		this.renderRoot.querySelectorAll<MonitorRadio>('monitor-radio')
			.forEach((radio: MonitorRadio) => radio.checked = false);

		radio.checked = true;
	}

	onOkButtonClicked(event: Event) {
		//this.blockControls(true);

		const name = this.renderRoot.querySelector<MonitorTextInput>('#name').value,
			address = this.renderRoot.querySelector<MonitorTextInput>('#address').value,
			port = Number(this.renderRoot.querySelector<MonitorTextInput>('#port').value),
			show_error = this.renderRoot.querySelector<MonitorWarning>('monitor-warning#show_error'),
			newServer = languageClient.createMonitorServer();

		let serverType = -1;
		this.renderRoot.querySelectorAll<MonitorRadio>('#serverType')
			.forEach((element => {
				if (element.checked) {
					serverType = Number(element.value);
				}
			}));

		if (!name) {
			this.progress = 'hidden';
			this.blockControls(false);
			this.focus();
			this.renderRoot.querySelector<MonitorTextInput>('monitor-text-input#name').showRedLine(i18n.localize("INVALID_NAME", "Invalid name"),'text');
			show_error.showTheError(i18n.localize("INVALID_SERVER_NAME", "Invalid server name"));

		}
		else if (serverType == -1){
			this.progress = 'hidden';
			this.blockControls(false);
			this.focus()
			show_error.showTheError(i18n.localize("INVALID_SERVER_TYPE_SELECTION", "Invalid server type selection"));
		}
		else if (!address){
			this.progress = 'hidden';
			this.blockControls(false);
			this.focus()
			this.renderRoot.querySelector<MonitorTextInput>('monitor-text-input#address').showRedLine(i18n.localize("INVALID_ADDRESS", "Invalid address"),'text');
			show_error.showTheError(i18n.localize("INVALID_SERVER_ADDRESS", "Invalid server address"));
		}
		else if(!port){
			this.progress = 'hidden';
			this.blockControls(false);
			this.focus()
			this.renderRoot.querySelector<MonitorTextInput>('monitor-text-input#port').showRedLine(i18n.localize("INVALID_PORT", "Invalid port"),'text');
			show_error.showTheError(i18n.localize("INVALID_SERVER_PORT", "Invalid server port"));
		}
		else {

			let cantStoreValue = [];
			const app = document.querySelector('monitor-app');
			const listOfServers = app.settings;
			if (listOfServers && listOfServers.servers) {
				cantStoreValue = listOfServers.servers.filter(item => {
					return ((item.address == address && item.port == port) || item.name == name )});
			}
			if(cantStoreValue.length > 0) {
				this.progress = 'hidden';
				this.blockControls(false);
				this.focus();
				show_error.showTheError(i18n.localize("SERVER_DATA_ALREADY_REGISTERED", "Server data already registered"));
			}
			else {

				this.blockControls(true);

				newServer.serverType = serverType;
				//console.log("newServer.serverType: "+newServer.serverType);
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

						let serverId = Math.random().toString(36).substring(3);
						app.addServer({
							serverId: serverId,
							name: name,
							server: newServer
						});

						this.close();
					})
					.catch((error: Error) => {
						console.error(error);

						this.progress = 'hidden';
						this.blockControls(false);
						this.focus();
						show_error.showTheError(i18n.localize("VALIDATE_ERROR", "Could not validate server"));
					});
			}

		}
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}

