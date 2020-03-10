import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-connection-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorDialog } from './monitor-dialog';
import { MonitorServerItem } from './monitor-server-item';
import { MonitorTextInput } from './monitor-text-input';

@customElement('monitor-connection-dialog')
export class MonitorConnectionDialog extends MonitorDialog {

	monitorServerItem: MonitorServerItem;

	get environment(): string {
		return this.renderRoot.querySelector<MonitorTextInput>('#environment').value;
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

		this.title = 'Iniciar Conexão';
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<monitor-text-input id="environment" tabindex="1" type="text" label="Ambiente"></monitor-text-input>
		`;
	}

	blockControls(block: boolean) {
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
