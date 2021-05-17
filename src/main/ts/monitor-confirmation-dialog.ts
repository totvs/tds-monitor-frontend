import { CSSResult, customElement, html, property } from 'lit-element';
import { style } from '../css/monitor-confirmation-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorDialog } from './monitor-dialog';
import { i18n } from './util/i18n';

@customElement('monitor-confirmation-dialog')
export class MonitorConfirmationDialog extends MonitorDialog {

	@property({ type: String })
	public message: string = '';

	public yesCallback: any;
	public callbackParams: any;

	constructor() {
		super({
			progress: "hidden",
			escClose: true,
			buttons: [
				{
					text: i18n.yes(),
					click: (event) => this.onYesButtonClicked(event)
				},
				{
					text: i18n.no(),
					click: (event) => this.onNoButtonClicked(event)
				}
			]
		});
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			${this.message}
		`;
	}

	blockControls(block: boolean) {
		this.renderRoot.querySelectorAll<MonitorButton>('monitor-button')
			.forEach((element => {
				element.disabled = block;
			}));
	}

	onYesButtonClicked(event: Event) {
		this.blockControls(true);

		this.yesCallback(this.callbackParams);

 		this.close();
	}

	onNoButtonClicked(event: Event) {
		this.cancel();
	}

}
