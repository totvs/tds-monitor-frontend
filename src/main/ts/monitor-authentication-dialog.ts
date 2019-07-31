import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-authentication-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorCheckbox } from './monitor-checkbox';
import { MonitorDialog } from './monitor-dialog';
import { MonitorServerItem } from './monitor-server-item';
import { MonitorTextInput } from './monitor-text-input';

@customElement('monitor-authentication-dialog')
export class MonitorAuthenticationDialog extends MonitorDialog {

	monitorServerItem: MonitorServerItem;

	get username(): string {
		return this.renderRoot.querySelector<MonitorTextInput>('#user').value;
	}

	get environment(): string {
		return this.renderRoot.querySelector<MonitorTextInput>('#environment').value;
	}

	get password(): string {
		return this.renderRoot.querySelector<MonitorTextInput>('#password').value;
	}

	get storeToken(): boolean {
		return this.renderRoot.querySelector<MonitorCheckbox>('#store').checked;
	}

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
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<monitor-text-input id="environment" tabindex="1" type="text" label="Ambiente"></monitor-text-input>
			<monitor-text-input id="user" tabindex="2" type="text" label="Usuário"></monitor-text-input>
			<monitor-text-input id="password" tabindex="3" type="password" label="Senha"></monitor-text-input>
			<label>
				<monitor-checkbox id="store" tabindex="4" title="Armazenar informações para reconexão automática"></monitor-checkbox>
				<span>Armazenar informações para reconexão automática</span>
			</label>
		`;
	}

	blockControls(block: boolean) {
		this.querySelectorAll<MonitorTextInput | MonitorCheckbox>('monitor-text-input, monitor-checkbox')
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

		//Validar inputs aqui

 		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
