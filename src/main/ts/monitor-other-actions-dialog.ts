import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-other-actions-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { MonitorButton } from './monitor-button';
import { TdsMonitorServer } from '@totvs/tds-languageclient';
import { MonitorRadio } from './monitor-radio';

@customElement('monitor-other-actions-dialog')
export class MonitorOtherActionsDialog extends MonitorDialog {

	server: TdsMonitorServer;
	connectionStatus: boolean;

	constructor(server: TdsMonitorServer, connectionStatus: boolean) {
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

		this.title = 'Outras ações';

		this.server = server;
		this.connectionStatus = connectionStatus;
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<label @click="${this.onLabelClick}">
				<monitor-radio id="setConnectionStatus" tabindex="1" name="otherActionsType" title="${this.connectionStatus ? 'Desabilitar' : 'Habilitar'} novas conexões"></monitor-radio>
				<span>${this.connectionStatus ? 'Desabilitar' : 'Habilitar'} novas conexões</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio id="stopServer" tabindex="2" name="otherActionsType" title="Parar o Servidor"></monitor-radio>
				<span>Parar o Servidor</span>
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

		let setConnectionStatus = this.renderRoot.querySelector<MonitorRadio>('monitor-radio#setConnectionStatus'),
			stopServer = this.renderRoot.querySelector<MonitorRadio>('monitor-radio#stopServer');

		if (setConnectionStatus.checked) {
			this.server.setConnectionStatus(!this.connectionStatus);
		}
		else if (stopServer.checked) {
			this.server.stopServer();
		}

		this.blockControls(false);
		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
