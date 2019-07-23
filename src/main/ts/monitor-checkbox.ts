import { Checkbox } from '@material/mwc-checkbox';
import { css, customElement, property } from 'lit-element';
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
