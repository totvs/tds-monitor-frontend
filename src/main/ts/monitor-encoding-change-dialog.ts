import { CSSResult, customElement, html } from "lit-element";
import { style } from "../css/monitor-encoding-change-dialog.css";
import { MonitorButton } from "./monitor-button";
import { MonitorDialog } from "./monitor-dialog";
import { MonitorRadio } from "./monitor-radio";
import { TdsMonitorServer } from "@totvs/tds-languageclient";
import { i18n } from "./util/i18n";

@customElement("monitor-encoding-change-dialog")
export class MonitorChangeEncodingDialog extends MonitorDialog {

	server: TdsMonitorServer = null;
	environment: string;
	currentEnvEncodes: EnvEncode[];
	currentEncoding: number;

	constructor(server: TdsMonitorServer, environment: string) {
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

		this.server = server;
		this.environment = environment;

		this.currentEnvEncodes = this.server.environmentEncoding ? this.server.environmentEncoding.filter(
			(envEncode) => envEncode.environment == environment
		) : [];
		this.currentEncoding = this.currentEnvEncodes.length == 1 ? this.currentEnvEncodes[0].encoding : 0;

		this.title = i18n.localize("ENCODING_CHANGE", "Change Environment Encoding");
	}

	static get styles(): CSSResult {
		return style;
	}

	get body() {
		return html`
			<monitor-warning
				id="show_error"
				msg=""
				showError="no"
			></monitor-warning>
			<monitor-text-input
				id="address"
				value="${this.environment}"
				type="text"
				label="${i18n.localize("ENVIRONMENT", "Environment")}"
				disabled=true
			></monitor-text-input>
			<label @click="${this.onLabelClick}">
				<monitor-radio
					id="envEncode"
					value="0"
					?checked="${this.currentEncoding == 0}"
					tabindex="0"
					name="envEncode"
					title="${i18n.CP1252()}"
				></monitor-radio>
				<span>${i18n.CP1252()}</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio
					id="envEncode"
					value="1"
					?checked="${this.currentEncoding == 1}"
					tabindex="1"
					name="envEncode"
					title="${i18n.CP1251()}"
				></monitor-radio>
				<span>${i18n.CP1251()}</span>
			</label>
			<label @click="${this.onLabelClick}">
				<monitor-radio
					id="envEncode"
					value="2"
					?checked="${this.currentEncoding == 2}"
					tabindex="2"
					name="envEncode"
					title="${i18n.UTF8()}"
				></monitor-radio>
				<span>${i18n.UTF8()}</span>
			</label>
		`;
	}

	blockControls(block: boolean) {
		this.renderRoot
			.querySelectorAll<MonitorRadio>("monitor-radio")
			.forEach((element) => {
				element.disabled = block;
			});

		this.renderRoot
			.querySelectorAll<MonitorButton>("monitor-button")
			.forEach((element) => {
				element.disabled = block;
			});
	}

	onLabelClick(event: MouseEvent) {
		let label = event.currentTarget as HTMLLabelElement,
			radio = label.querySelector<MonitorRadio>("monitor-radio");

		this.renderRoot
			.querySelectorAll<MonitorRadio>("monitor-radio")
			.forEach((radio: MonitorRadio) => (radio.checked = false));

		radio.checked = true;
	}

	onOkButtonClicked(event: Event) {
		this.blockControls(true);

		let envEncode: number = 0;
		this.renderRoot
			.querySelectorAll<MonitorRadio>("#envEncode")
			.forEach((element) => {
				if (element.checked) {
					envEncode = Number(element.value);
				}
			});

		if (envEncode != this.currentEncoding) {
			const app = document.querySelector("monitor-app");
			app.onEnvironmentEncodingUpdate(app.currentServerId(), this.environment, envEncode);
			this.server.environmentEncoding.map((obj) => {
				if (obj.environment === this.environment) {
					obj.encoding = envEncode;
				}
				return obj;
			});
			let envEncodes: Array<EnvEncode> = this.server.environmentEncoding;
			this.server.setEnvEncodes(envEncodes);
		}

		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}
}
