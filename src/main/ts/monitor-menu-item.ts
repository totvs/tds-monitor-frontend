import { LitElement, html, customElement, property, css } from 'lit-element';

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

		if (options.items) {
			this.items = options.items.map(item => new MonitorMenuItem(item));
		}

		if (options.callback) {
			this.clickCallback = options.callback;
		}
	}

	static get styles() {
		return css`
			li {
				cursor: pointer;
				user-select: none;
				display: flex;
				position: relative;
				align-items: center;
				justify-content: flex-start;
				height: 48px;
				padding: 0 16px;
				overflow: hidden;
				list-style-type: none;
			}

			li:hover {
				background-color: #e1e1e1;
			}

			li.separator {
				border-bottom: 1px solid rgba(0,0,0,.12);
			}
		`;
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
