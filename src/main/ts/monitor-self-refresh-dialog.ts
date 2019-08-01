import { customElement, CSSResult, html } from 'lit-element';
import { style } from '../css/monitor-self-refresh-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { MonitorButton } from './monitor-button';
import { MonitorRadio } from './monitor-radio';
import { MonitorTextInput } from './monitor-text-input';


@customElement('monitor-self-refresh-dialog')
export class MonitorSelfRefreshDialog extends MonitorDialog {

	updateInterval: number;
	selected: number;

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

		this.title = 'Intervalo de atualização';

		const app = document.querySelector('monitor-app');

		this.updateInterval = app.config.updateInterval;
		if (this.updateInterval == 5) {
			this.selected = 1;
		}
		else if (this.updateInterval == 15) {
			this.selected = 2;
		}
		else if (this.updateInterval == 30) {
			this.selected = 3;
		}
		else {
			this.selected = 4;
		}
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<label @click="${this.onLabelClick}">
				<monitor-radio id="setFastInterval" tabindex="1" name="setUpdateIntervalType" title="5 segundos" ?checked=${this.selected == 1}></monitor-radio>
				<span>5 segundos</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio id="setMediumInterval" tabindex="2" name="setUpdateIntervalType" title="15 segundos" ?checked=${this.selected == 2}></monitor-radio>
				<span>15 segundos</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio id="setSlowInterval" tabindex="3" name="setUpdateIntervalType" title="30 segundos" ?checked=${this.selected == 3}></monitor-radio>
				<span>30 segundos</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio id="setCustomInterval" tabindex="4" name="setUpdateIntervalType" title="Definir intervalo personalizado" ?checked=${this.selected == 4}></monitor-radio>
				<monitor-text-input id="customUpdateInterval" tabindex="5" type="number" min="0" max="3600" small value="${this.updateInterval}"></monitor-text-input><span>segundos</span>
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

		this.renderRoot.querySelectorAll<MonitorTextInput>('monitor-text-input')
			.forEach((element: MonitorTextInput) => {
				element.disabled = block;
			});
	}

	onOkButtonClicked(event: Event) {
		this.blockControls(true);

		const app = document.querySelector('monitor-app');

		let setFastInterval = this.renderRoot.querySelector<MonitorRadio>('monitor-radio#setFastInterval'),
			setMediumInterval = this.renderRoot.querySelector<MonitorRadio>('monitor-radio#setMediumInterval'),
			setSlowInterval = this.renderRoot.querySelector<MonitorRadio>('monitor-radio#setSlowInterval'),
			setCustomInterval = this.renderRoot.querySelector<MonitorRadio>('monitor-radio#setCustomInterval'),
			customUpdateInterval = parseInt(this.renderRoot.querySelector<MonitorTextInput>('monitor-text-input#customUpdateInterval').value, 0),
			newUpdateInterval;

		if (setFastInterval.checked) {
			newUpdateInterval = 5;
		}
		else if (setMediumInterval.checked) {
			newUpdateInterval = 15;
		}
		else if (setSlowInterval.checked) {
			newUpdateInterval = 30;
		}
		else if (setCustomInterval.checked) {
			newUpdateInterval = customUpdateInterval;
		}
		app.config = {
			updateInterval: newUpdateInterval,
			language: app.config.language,
			alwaysOnTop: app.config.alwaysOnTop,
			generateUpdateLog: app.config.generateUpdateLog,
			generateExecutionLog: app.config.generateExecutionLog
		};

		app.dispatchEvent(new CustomEvent<string>('settings-update', {
			detail: 'Settings update.',
			bubbles: true,
			composed: true
		}));

		this.blockControls(false);
		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
