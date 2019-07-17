import { customElement, property, css } from "lit-element";
import { Checkbox } from '@material/mwc-checkbox';
import { style } from '../css/monitor-checkbox.css';

@customElement('monitor-checkbox')
export class MonitorCheckbox extends Checkbox {

	@property({type: Boolean, reflect: true, attribute: true})
	disabled = false;

	@property({type: Boolean, reflect: true, attribute: true})
	checked = false;

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
