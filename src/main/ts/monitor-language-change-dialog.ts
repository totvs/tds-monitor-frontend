import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-language-change-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { i18n } from './util/i18n';

@customElement('monitor-language-change-dialog')
export class MonitorLanguageChangeDialog extends MonitorDialog {

	constructor() {
		super({
			escClose: true,
			buttons: [
				{
					text: i18n.ok(),
					click: (event) => this.onOkButtonClicked(event)
				}
			]
		});

		this.title = i18n.localize("LANGUAGE_CHANGE_TOTVS_MONITOR", "Language Changed");
		this.progress = 'none';
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		//const app = document.querySelector('monitor-app');
        return html`
            ${i18n.localize("LANGUAGE_CHANGE_INFO", "In order to language change to display takes effect a restart is required.")}
		`;
	}

	onOkButtonClicked(event: Event) {
		this.close();
	}

}
