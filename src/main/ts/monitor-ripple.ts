import { customElement, property, html } from "lit-element";
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

	/*
	_onMouseEnter = (event: MouseEvent) => { this.active = true; event.stopPropagation(); };
	_onMouseExit = (event: MouseEvent) => { this.active = false; event.stopPropagation(); };

	connectedCallback() {
		super.connectedCallback();

		this.interactionNode.addEventListener('mouseover', this._onMouseEnter);
		this.interactionNode.addEventListener('mouseout', this._onMouseExit);
	}

	disconnectedCallback() {
		super.disconnectedCallback();

		this.interactionNode.removeEventListener('mouseover', this._onMouseEnter);
		this.interactionNode.removeEventListener('mouseout', this._onMouseExit);
	}
	*/

	render() {
		return html`
			<style>
				div.mdc-ripple-surface::before, div.mdc-ripple-surface::after {
    				background-color: ${this.dark ? '#FFFFFF' : '#000000'};
				}
			</style>
			${super.render()}
		`;
	}

}
