import { customElement, css } from "lit-element";
import { Radio } from '@material/mwc-radio';
import { style } from '../css/monitor-radio.css';

@customElement('monitor-radio')
export class MonitorRadio extends Radio {

	constructor() {
		super();
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
		'monitor-radio': MonitorRadio;
	}
}
