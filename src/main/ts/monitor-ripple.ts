import { customElement, property, html, css } from "lit-element";
import { Ripple } from "@material/mwc-ripple";

@customElement('monitor-ripple')
export class MonitorRipple extends Ripple {

	@property({ type: Boolean, reflect: true, attribute: true })
	primary = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	active: boolean | undefined = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	accent: boolean = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	unbounded: boolean = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	disabled: boolean = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	dark: boolean = false;

	constructor() {
		super();
	}

	static get style() {
		return css`
			${super.styles}
		`;
	}


	render() {
		return html`
			<style>
				${this.dark ? '' : html`
				div.mdc-ripple-surface::before, div.mdc-ripple-surface::after {
    				background-color: #FFFFFF;
				}`
				}
			</style>
			${super.render()}
		`;
	}

}
