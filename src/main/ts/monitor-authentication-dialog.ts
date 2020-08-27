import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-authentication-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorCheckbox } from './monitor-checkbox';
import { MonitorDialog } from './monitor-dialog';
import { MonitorServerItem } from './monitor-server-item';
import { MonitorTextInput } from './monitor-text-input';
import { i18n } from './util/i18n';

@customElement('monitor-authentication-dialog')
export class MonitorAuthenticationDialog extends MonitorDialog {

	monitorServerItem: MonitorServerItem;

	get username(): string {
		return this.renderRoot.querySelector<MonitorTextInput>('#user').value;
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
					text: i18n.ok(),
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: i18n.cancel(),
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.monitorServerItem = monitorServerItem;

		this.title = i18n.localize("AUTHENTICATE_CONNECTION", "Authenticate Connection");
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<monitor-text-input id="user" tabindex="2" type="text" label="${i18n.localize("USER", "User")}"></monitor-text-input>
			<monitor-text-input id="password" tabindex="3" type="password" label="${i18n.localize("PASS", "Password")}"></monitor-text-input>
			<label>
				<monitor-checkbox id="store" tabindex="4" title="${i18n.localize("STORE_DATA_RECONNECTION", "Store information for automatic reconnection")}"></monitor-checkbox>
				<span>${i18n.localize("STORE_DATA_RECONNECTION", "Store information for automatic reconnection")}</span>
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
