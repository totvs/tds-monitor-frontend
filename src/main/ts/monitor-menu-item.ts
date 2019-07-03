import { LitElement, html, customElement, property, CSSResult, css } from 'lit-element';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-menu-item': MonitorMenuItem;
	}
}

/*extends Drawer*/
@customElement('monitor-menu-item')
export class MonitorMenuItem extends LitElement {

	@property({ type: Array })
	items: MonitorMenuItem[] = [];

	@property({ type: String })
	text: string = '';

	constructor() {
		super();
	}

	render() {
		return html`
			<li>
				<span>${this.text}</span>
			</li>

		`;
	}
}
