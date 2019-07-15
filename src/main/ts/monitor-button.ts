import { customElement, html, property } from "lit-element";
import { Button } from '@material/mwc-button';

export interface ButtonOptions {
	text: string;
	click: (event: MouseEvent) => boolean | void
}

@customElement('monitor-button')
export class MonitorButton extends Button {

	options: ButtonOptions;

	@property({type: Boolean, reflect: true, attribute: true})
	disabled = false;

	constructor(options: ButtonOptions) {
		super();

		//this.disabled = false;
		//this.raised = true
		//this.outlined = true;

		this.options = Object.assign({}, options);

		this.innerText = this.options.text;

		this.addEventListener('click', (event: MouseEvent) => {
			if (this.options.click)
				return this.options.click(event);
		})
	}

//6200ee
	/*
	render() {
		return html`
			<style>
				button.mdc-button:not(:disabled) {
					-background-color: #494440;
					-color: #494440;
				}

				button.mdc-button::before, button.mdc-button::after {
					-color: gray;
					-background-color: #494440;
				}
			</style>
			${super.render()}
		`;
	}
	*/
}
/*
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

	@property({type: Boolean, reflect: true})
	disabled = false;

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
			<button
				@click="${this.onClicked}"
				?disabled="${this.disabled}"
			>
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
*/
