import { customElement, property, css } from "lit-element";
import { Button } from '@material/mwc-button';
import { style } from '../css/monitor-button.css';

export interface ButtonOptions {
	text: string;
	click: (event: MouseEvent) => boolean | void
}

@customElement('monitor-button')
export class MonitorButton extends Button {

	options: ButtonOptions;

	@property({type: Boolean, reflect: true, attribute: true})
	disabled = false;


	@property({type: Boolean, reflect: true, attribute: true})
	small = false;

	constructor(options: ButtonOptions) {
		super();

		this.options = Object.assign({}, options);

		if (this.options.text)
			this.innerText = this.options.text;

		this.addEventListener('click', (event: MouseEvent) => {
			if (this.options.click)
				return this.options.click(event);
		})
	}


	static get styles() {
		return css`
			${super.styles}
			${style}
		`;
	}

}


declare global {
	interface HTMLElementTagNameMap {
		'monitor-button': MonitorButton;
	}
}
