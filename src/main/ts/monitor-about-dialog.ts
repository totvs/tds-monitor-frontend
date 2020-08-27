import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-about-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { i18n } from './util/i18n';

@customElement('monitor-about-dialog')
export class MonitorAboutDialog extends MonitorDialog {

	constructor() {
		super({
			escClose: true,
			buttons: [
				{
					text: i18n.close(),
					click: (event) => this.onCloseButtonClicked(event)
				}
			]
		});

		this.title = i18n.localize("ABOUT_TOTVS_MONITOR", "About TOTVS Monitor");
		this.progress = 'none';
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		const app = document.querySelector('monitor-app');

		return html`
			<img>
			<h1>${i18n.totvsMonitor()}</h1>
			<h4>v${app.version}</h4>
			${Object.keys(app.dependencies).map((key: keyof Versions) => html`
				<h4>${key}: ${app.dependencies[key]}</h4>
			`)}
		`;
	}

	onCloseButtonClicked(event: Event) {
		this.close();
	}

}

