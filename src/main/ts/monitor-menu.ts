import { LitElement, html, customElement, property, CSSResult, css } from 'lit-element';
import { MonitorMenuItem } from './monitor-menu-item';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-menu': MonitorMenu;
	}
}

/*extends Drawer*/
@customElement('monitor-menu')
export class MonitorMenu extends LitElement {

	@property({ type: Array })
	items: MonitorMenuItem[] = [];

	constructor() {
		super();
	}


	render() {
		return html`
			<ul>
				${this.items}
			</ul>

		`;
	}
}
