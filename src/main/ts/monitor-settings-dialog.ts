import { CSSResult, customElement } from 'lit-element';
import { html, render } from 'lit-html';
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

		const app = document.querySelector('monitor-app'),
			{
				language,
				updateInterval,
				alwaysOnTop,
				generateUpdateLog,
				generateExecutionLog
			} = app.config;

		let content = () => html`
			<style>
				section {
					flex: 1 1 100%;
					display: flex;
					flex-direction: row;
					align-items: center;
					height: 60px;
				}

				section monitor-text-input {
					display: flex;
					margin: 10px;
					width: 80px;
					height: 24px;
				}

				section select {
					padding: 10px;
				}

				section label {
					flex: 1 1 100%;
				}

				section mwc-switch {
					margin-right: 10px;
					--mdc-theme-secondary: #EA9B3E;
				}
			</style>
			<section>
				<label for="language">Idioma</label>
				<select id="language">
					<option value="portuguese" ?selected="${language === 'portuguese'}">Português</option>
					<option value="english" ?selected="${language === 'english'}">Inglês</option>
					<option value="spanish" ?selected="${language === 'spanish'}">Espanhol</option>
				</select>
			</section>
			<section>
				<label for="updateInterval">Intervalo para atualizacao de informações</label>
				<monitor-text-input id="updateInterval" tabindex="1" type="number" spellcheck="$1" small value="${updateInterval}"></monitor-text-input>
			</section>
			<section>
				<label for="alwaysOnTop">Manter sempre no topo das janelas</label>
				<mwc-switch id="alwaysOnTop" ?checked=${alwaysOnTop}></mwc-switch>
			</section>
			<section>
				<label for="generateUpdateLog">Gerar arquivo de log a cada atualização</label>
				<mwc-switch id="generateUpdateLog" ?checked=${generateUpdateLog}></mwc-switch>
			</section>
			<section>
				<label for="generateExecutionLog">Gerar log de execução de rotinas</label>
				<mwc-switch id="generateExecutionLog" ?checked=${generateExecutionLog}></mwc-switch>
			</section>
		`;

		render(content(), this);
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			${super.render()}
		`;
	}

	onOkButtonClicked(event: Event) {
		const app = document.querySelector('monitor-app');

		app.config = {
			updateInterval: parseInt(this.querySelector<MonitorTextInput>('#updateInterval').value, 10),
			language: this.querySelector<HTMLSelectElement>('#language').value as any,
			alwaysOnTop: this.querySelector<MonitorCheckbox>('#alwaysOnTop').checked,
			generateUpdateLog: this.querySelector<MonitorCheckbox>('#generateUpdateLog').checked,
			generateExecutionLog: this.querySelector<MonitorCheckbox>('#generateExecutionLog').checked
		};

		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}

