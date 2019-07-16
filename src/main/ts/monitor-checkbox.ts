import { customElement, property } from "lit-element";
import { Checkbox } from '@material/mwc-checkbox';

@customElement('monitor-checkbox')
export class MonitorCheckbox extends Checkbox {

	@property({type: Boolean, reflect: true, attribute: true})
	disabled = false;

	constructor() {
		super();
	}

}
