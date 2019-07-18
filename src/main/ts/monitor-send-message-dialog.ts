import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-send-message-dialog.css';
import { MonitorTextInput } from './monitor-text-input';
import { MonitorDialog } from './monitor-dialog';
import { MonitorButton } from './monitor-button';

@customElement('monitor-send-message-dialog')
export class MonitorSendMessageDialog extends MonitorDialog {

	get message(): string {
		return this.querySelector<MonitorTextInput>('#message').value;
	}

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

		this.title = 'Enviar Mensagem';
		this.progress = 'hidden';

		this.innerHTML = html`
			<monitor-text-input id="message" tabindex="1" type="text" label="Mensagem"></monitor-text-input>
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
		this.blockControls(true);

		//Validar inputs aqui
		const message = this.querySelector<MonitorTextInput>('#message').value;
		if (message.length == 0) {
			// alert ou outro modal com o erro ???
			this.blockControls(false);
		}
		else {
			this.close();
		}
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}

