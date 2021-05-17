import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-settings-dialog.css';
import { MonitorCheckbox } from './monitor-checkbox';
import { MonitorDialog } from './monitor-dialog';
import { MonitorTextInput } from './monitor-text-input';
import { i18n } from './util/i18n';
import { MonitorLanguageChangeDialog } from './monitor-language-change-dialog';

@customElement('monitor-settings-dialog')
export class MonitorSettingsDialog extends MonitorDialog {
	private currentLanguage: any = undefined;

	constructor() {
		super({
			escClose: true,
			buttons: [
				{
					text: i18n.confirm(),
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: i18n.cancel(),
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = i18n.localize("CONFIGURATIONS", "Configurations");
		this.progress = 'none';

		const app = document.querySelector('monitor-app');
		this.currentLanguage = app.config.language;
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
			<section>
				<label for="language">${i18n.localize("LANGUAGE", "Language")}</label>
				<select id="language">
					<option value="portuguese" ?selected="${language === 'portuguese'}">${i18n.localize("PORTUGUESE", "Portuguese")}</option>
					<option value="english" ?selected="${language === 'english'}">${i18n.localize("ENGLISH", "English")}</option>
					<option value="spanish" ?selected="${language === 'spanish'}">${i18n.localize("SPANISH", "Spanish")}</option>
				</select>
			</section>

			<section>
				<label for="updateInterval">${i18n.localize("INFORMATION_UPDATE_INTERVAL", "Information update interval")}</label>
				<monitor-text-input id="updateInterval" tabindex="1" type="number" min="0" max="3600" small value="${updateInterval}"></monitor-text-input>
			</section>

			<!--[TODO: Falta implementar]-->
			<strike>
			<section>
				<label for="alwaysOnTop">${i18n.localize("KEEP_ON_TOP", "Keep this on top")}</label>
				<mwc-switch disabled id="alwaysOnTop" ?checked=${alwaysOnTop}></mwc-switch>
			</section>
			<section>
				<label for="generateUpdateLog">${i18n.localize("GENERATE_LOG", "Generate log files on every update")}</label>
				<mwc-switch disabled id="generateUpdateLog" ?checked=${generateUpdateLog}></mwc-switch>
			</section>
			<section>
				<label for="generateExecutionLog">${i18n.localize("GENERATE_EXEC_LOG", "Generate execution log")}</label>
				<mwc-switch disabled id="generateExecutionLog" ?checked=${generateExecutionLog}></mwc-switch>
			</section>
			</strike>`;
	}

	onOkButtonClicked(event: Event) {
		//console.log('onOkButtonClicked: %s', this.renderRoot.querySelector<MonitorTextInput>('#updateInterval').value);

		const app = document.querySelector('monitor-app');

		app.config = Object.assign<MonitorSettingsConfig, MonitorSettingsConfig>(app.config, {
			updateInterval: parseInt(this.renderRoot.querySelector<MonitorTextInput>('#updateInterval').value, 10),
			language: this.renderRoot.querySelector<HTMLSelectElement>('#language').value as any,
			alwaysOnTop: this.renderRoot.querySelector<MonitorCheckbox>('#alwaysOnTop').checked,
			generateUpdateLog: this.renderRoot.querySelector<MonitorCheckbox>('#generateUpdateLog').checked,
			generateExecutionLog: this.renderRoot.querySelector<MonitorCheckbox>('#generateExecutionLog').checked
		});

		if (this.currentLanguage && app.config.language !== this.currentLanguage) {
			const dialog = new MonitorLanguageChangeDialog();
			dialog.show();
		}

		app.dispatchEvent(new CustomEvent<string>('settings-update', {
			detail: i18n.localize("UPDATE_SETTINGS", "Update settings."),
			bubbles: true,
			composed: true
		}));

		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
