import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-settings-dialog.css';
import { MonitorCheckbox } from './monitor-checkbox';
import { MonitorDialog } from './monitor-dialog';
import { MonitorTextInput } from './monitor-text-input';

@customElement('monitor-settings-dialog')
export class MonitorSettingsDialog extends MonitorDialog {

	constructor() {
		super({
			escClose: true,
			buttons: [
				{
					text: 'Confirmar',
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: 'Cancelar',
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = 'Configurações';
		this.progress = 'none';
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			${super.render()}
		`;
	}

	get body() {
		const app = document.querySelector('monitor-app'),
			{
				language,
				updateInterval,
				alwaysOnTop,
				generateUpdateLog,
				generateExecutionLog
			} = app.config;

		return html`
			<!--[TODO: Falta implementar]-->
			<section>
				<label for="language"><strike>Idioma</strike></label>
				<select id="language" disabled>
					<option value="portuguese" ?selected="${language === 'portuguese'}">Português</option>
					<option value="english" ?selected="${language === 'english'}">Inglês</option>
					<option value="spanish" ?selected="${language === 'spanish'}">Espanhol</option>
				</select>
			</section>

			<section>
				<label for="updateInterval">Intervalo para atualização de informações</label>
				<monitor-text-input id="updateInterval" tabindex="1" type="number" min="0" max="3600" small value="${updateInterval}"></monitor-text-input>
			</section>

			<!--[TODO: Falta implementar]-->
			<strike>
			<section>
				<label for="alwaysOnTop">Manter sempre no topo das janelas</label>
				<mwc-switch disabled id="alwaysOnTop" ?checked=${alwaysOnTop}></mwc-switch>
			</section>
			<section>
				<label for="generateUpdateLog">Gerar arquivo de log a cada atualização</label>
				<mwc-switch disabled id="generateUpdateLog" ?checked=${generateUpdateLog}></mwc-switch>
			</section>
			<section>
				<label for="generateExecutionLog">Gerar log de execução de rotinas</label>
				<mwc-switch disabled id="generateExecutionLog" ?checked=${generateExecutionLog}></mwc-switch>
			</section>
			</strike>`;
	}

	onOkButtonClicked(event: Event) {
		console.log('onOkButtonClicked: %s', this.renderRoot.querySelector<MonitorTextInput>('#updateInterval').value);

		const app = document.querySelector('monitor-app');

		app.config = {
			updateInterval: parseInt(this.renderRoot.querySelector<MonitorTextInput>('#updateInterval').value, 10),
			language: this.renderRoot.querySelector<HTMLSelectElement>('#language').value as any,
			alwaysOnTop: this.renderRoot.querySelector<MonitorCheckbox>('#alwaysOnTop').checked,
			generateUpdateLog: this.renderRoot.querySelector<MonitorCheckbox>('#generateUpdateLog').checked,
			generateExecutionLog: this.renderRoot.querySelector<MonitorCheckbox>('#generateExecutionLog').checked
		};

		app.dispatchEvent(new CustomEvent<string>('settings-update', {
			detail: 'Settings update.',
			bubbles: true,
			composed: true
		}));

		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
