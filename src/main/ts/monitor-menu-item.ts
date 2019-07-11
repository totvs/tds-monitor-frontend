import { LitElement, html, customElement, property } from 'lit-element';
import { style } from '../css/monitor-menu-item.css';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-menu-item': MonitorMenuItem;
	}
}

export interface MenuItemOptions {
	text: string;
	separator?: boolean;
	callback?: () => boolean | void;
	items?: MenuItemOptions[]
}

/*extends Drawer*/
@customElement('monitor-menu-item')
export class MonitorMenuItem extends LitElement {

	separator: boolean = false;

	@property({ type: Array })
	items: MonitorMenuItem[] = [];

	@property({ type: String })
	text: string = '';

	@property({ type: String })
	clickCallback: () => boolean | void = null;

	constructor(options: MenuItemOptions) {
		super();

		this.text = options.text;

		if (options.separator) {
			this.separator = options.separator;
		}

		if ((options.items) && (options.items.length > 0)) {
			const items = options.items;

			if (items[items.length - 1].separator)
				items[items.length - 1].separator = false;

			this.items = items.map(item => new MonitorMenuItem(item));
		}

		if (options.callback) {
			this.clickCallback = options.callback;
		}
	}

	static get styles() {
		return style;
	}

	//#e1e1e1 ou f2f2f2
	render() {
		let classes = this.separator ? 'separator' : '';

		return html`
			<li class="${classes}" @click="${this.onLeftClick}" @contextmenu="${this.onRightClick}">
				<mwc-ripple @transitionend="${this.onAnimationEnd}"></mwc-ripple>
				<span>${this.text}</span>
				<ul>
					${this.items}
				</ul>
			</li>
		`;
	}

	onAnimationEnd(event: Event) {
		console.log('transitionend');
	}

	protected onLeftClick(event: MouseEvent) {
		let bubble: boolean | void = true;

		if (this.clickCallback)
			bubble = this.clickCallback();

		if (bubble === false)
			event.stopPropagation();

		return false;
	}

	protected onRightClick(event: MouseEvent) {
		event.stopPropagation();

		return false;
	}
}
