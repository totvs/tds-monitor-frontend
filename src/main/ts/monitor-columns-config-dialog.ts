import { CSSResult, customElement, html } from 'lit-element';
import { style } from '../css/monitor-columns-config-dialog.css';
import { MonitorDialog } from './monitor-dialog';
import { i18n } from './util/i18n';
//import { defaultColumnOrder } from './monitor-columns';

@customElement('monitor-columns-config-dialog')
export class MonitorColumnsConfigDialog extends MonitorDialog {
	private currentColumnsConfig: any = undefined;

	constructor() {
		super({
			escClose: true,
			buttons: [
				{
					text: i18n.ok(),
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: i18n.cancel(),
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = i18n.localize("COLUMNS_CONFIG", "Columns Configuration");
        this.progress = 'none';
        
        const app = document.querySelector('monitor-app');
        this.currentColumnsConfig = app.config.columnsConfig;
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
        //const defaultColumnOrderConfig = defaultColumnOrder();
        let currentColumnOrderConfig = [];
        if (this.currentColumnsConfig) {
            currentColumnOrderConfig = this.currentColumnsConfig.split(',');
        }
        return html`
            <ul>
            ${currentColumnOrderConfig.map((key) => html`
                <li>${key}</li>
            `)}
            </ul>
		`;
	}

	onOkButtonClicked(event: Event) {
        let arrayTest = [
            'usernameDisplayed',
            'clientType',
            'environment',
            'threadId',
            'mainName',
            'remark'
        ];
        let userColumnsConfig = arrayTest.join(",");
        if (userColumnsConfig !== this.currentColumnsConfig) {
            const app = document.querySelector('monitor-app');
            app.config = {
                updateInterval: app.config.updateInterval,
                language: app.config.language,
                alwaysOnTop: app.config.alwaysOnTop,
                generateUpdateLog: app.config.generateUpdateLog,
                generateExecutionLog: app.config.generateExecutionLog,
                columnsConfig: userColumnsConfig
            };
            app.dispatchEvent(new CustomEvent<string>('settings-update', {
                detail: i18n.localize("UPDATE_SETTINGS", "Update settings."),
                bubbles: true,
                composed: true
            }));
        }
		this.close();
	}

    onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}
