import {
	CSSResult,
	customElement,
	html,
	LitElement,
	property,
} from "lit-element";
import { style } from "../css/monitor-app-bar.css";
import { i18n } from "./util/i18n";

declare type WindowState = "minimized" | "maximized" | "restored";

@customElement("monitor-app-bar")
export class MonitorAppBar extends LitElement {
	@property({ type: String })
	public text: string = i18n.totvsMonitor();

	@property({ type: String })
	public icon: string = i18n.totvsMonitorIcon();

	@property({ type: String })
	public state: WindowState = "restored";

	get maximizeIcon() {
		switch (this.state) {
			case "maximized":
				return "filter_none";
			default:
				return "crop_square";
		}
	}

	constructor() {
		super();

		window.addEventListener("maximized", () => {
			this.state = "maximized";
			this.requestUpdate("maximizeIcon");
		});

		window.addEventListener("restored", () => {
			this.state = "restored";
			this.requestUpdate("maximizeIcon");
		});
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<header>
				<img class="logo" src="${this.icon}" height="36" width="36" />
				<h1>${this.text}</h1>
				<mwc-icon-button
					id="minimize"
					icon="minimize"
					@click="${this.onButtonMinimizeClick}"
				></mwc-icon-button>
				<mwc-icon-button
					id="maximize"
					icon="${this.maximizeIcon}"
					@click="${this.onButtonMaximizeClick}"
				></mwc-icon-button>
				<mwc-icon-button
					id="close"
					icon="close"
					@click="${this.onButtonCloseClick}"
				></mwc-icon-button>
			</header>
		`;
	}

	onButtonMaximizeClick(event: Event) {
		if (this.state === "maximized") window.restore();
		else if (this.state === "restored") window.maximize();
	}

	onButtonMinimizeClick(event: Event) {
		window.minimize();
	}

	onButtonCloseClick(event: Event) {
		window.close();
	}
}
