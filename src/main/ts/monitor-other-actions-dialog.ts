import { customElement, CSSResult, html } from "lit-element";
import { style } from "../css/monitor-other-actions-dialog.css";
import { MonitorDialog } from "./monitor-dialog";
import { MonitorButton } from "./monitor-button";
import { TdsMonitorServer } from "@totvs/tds-languageclient";
import { MonitorRadio } from "./monitor-radio";
import { i18n } from "./util/i18n";

@customElement("monitor-other-actions-dialog")
export class MonitorOtherActionsDialog extends MonitorDialog {
	server: TdsMonitorServer;
	connectionStatus: boolean;

	constructor(server: TdsMonitorServer, connectionStatus: boolean) {
		super({
			escClose: true,
			buttons: [
				{
					text: i18n.ok(),
					click: (event) => this.onOkButtonClicked(event),
				},
				{
					text: i18n.cancel(),
					click: (event) => this.onCancelButtonClicked(event),
				},
			],
		});

		this.title = i18n.localize("OTHER_ACTIONS", "Other actions");

		this.server = server;
		this.connectionStatus = connectionStatus;
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		let action = this.connectionStatus ? i18n.disable() : i18n.enable();
		let setConnectionStatusTitle = i18n.localize(
			"NEW_CONNECTIONS_ACTION",
			"{0} new connections",
			action
		);
		return html`
			<label @click="${this.onLabelClick}">
				<monitor-radio
					id="setConnectionStatus"
					tabindex="1"
					name="otherActionsType"
					title="${setConnectionStatusTitle}"
				></monitor-radio>
				<span>${setConnectionStatusTitle}</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio
					id="stopServer"
					tabindex="2"
					name="otherActionsType"
					title="${i18n.localize("STOP_SERVER", "Stop Server")}"
				></monitor-radio>
				<span>${i18n.localize("STOP_SERVER", "Stop Server")}</span>
			</label>
		`;
	}

	onLabelClick(event: MouseEvent) {
		let label = event.currentTarget as HTMLLabelElement,
			radio = label.querySelector<MonitorRadio>("monitor-radio");

		this.renderRoot
			.querySelectorAll<MonitorRadio>("monitor-radio")
			.forEach((radio: MonitorRadio) => (radio.checked = false));

		radio.checked = true;
	}

	blockControls(block: boolean) {
		this.renderRoot
			.querySelectorAll<MonitorRadio>("monitor-radio")
			.forEach((element: MonitorRadio) => {
				element.disabled = block;
			});

		this.renderRoot
			.querySelectorAll<MonitorButton>("monitor-button")
			.forEach((element: MonitorButton) => {
				element.disabled = block;
			});
	}

	onOkButtonClicked(event: Event) {
		this.blockControls(true);

		let setConnectionStatus = this.renderRoot.querySelector<MonitorRadio>(
				"monitor-radio#setConnectionStatus"
			),
			stopServer = this.renderRoot.querySelector<MonitorRadio>(
				"monitor-radio#stopServer"
			);

		if (setConnectionStatus.checked) {
			this.server.setConnectionStatus(!this.connectionStatus);
		} else if (stopServer.checked) {
			this.server.stopServer();
			this.server.disconnect();
		}

		this.blockControls(false);
		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}
}
