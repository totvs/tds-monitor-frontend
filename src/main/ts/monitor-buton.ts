import { LitElement, customElement, CSSResult, html, property } from "lit-element";
import { style } from '../css/monitor-button.css';


export interface ButtonOptions {
	text: string;
	click: (event: MouseEvent) => boolean | void
}

@customElement('monitor-button')
export class MonitorButton extends LitElement {

	options: ButtonOptions;

	@property({ type: String, reflect: true, attribute: true })
	text: string = '';

	constructor(options: ButtonOptions) {
		super();

		this.options = Object.assign({}, options);

		this.text = this.options.text;
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<button @click="${this.onClicked}">
				<monitor-ripple></monitor-ripple>
				${this.text}
			</button>
        `;
	}

	onClicked(event: MouseEvent) {
		if (this.options.click)
			return this.options.click(event);
	}
}


