import { LitElement, html, customElement, property } from 'lit-element';
import { MonitorMenuItem, MenuItemOptions } from './monitor-menu-item';
import { style } from '../css/monitor-menu.css';

export interface MenuOptions {
	position?: MenuOptionsPosition
	parent: HTMLElement;
	items?: MenuItemOptions[]
}

interface MenuOptionsPosition {
	x?: number;
	y?: number;
}

@customElement('monitor-menu')
export class MonitorMenu extends LitElement {

	private _open: boolean = false;
	private options: MenuOptions;
	private _documentBodyClickHandle = (event: MouseEvent) => this.onDocumentBodyClicked(event);

	@property({ type: Array })
	items: MonitorMenuItem[] = [];

	@property({ type: Boolean, reflect: true, attribute: true })
	get open(): boolean {
		return this._open;
	}
	set open(value: boolean) {
		const oldValue = this._open;
		this._open = value;

		requestAnimationFrame(() => {
			document.body.addEventListener('click', this._documentBodyClickHandle);
			document.body.addEventListener('contextmenu', this._documentBodyClickHandle);

			this.setPostition();
		});

		this.requestUpdate('open', oldValue);
	}

	constructor(options: MenuOptions) {
		super();

		document.body.appendChild(this);

		this.options = options;

		if ((options.items) && (options.items.length > 0)) {
			const items = options.items;

			if (items[items.length - 1].separator)
				items[items.length - 1].separator = false;

			this.items = items.map(item => new MonitorMenuItem(item));
		}
	}

	setPostition() {
		const position = this.options.position || {};

		if ((position.x !== undefined) && (position.y !== undefined)) {
			this.style.top = `${position.y}px`;
			this.style.left = `${position.x}px`;
		}
		else {
			const parent = this.options.parent,
				rect = parent.getBoundingClientRect();

			let top = (rect.top + rect.height),
				left = (rect.left + rect.width - this.clientWidth);

			this.style.top = `${top}px`;
			this.style.left = `${left}px`;
		}
	}

	onDocumentBodyClicked(event: MouseEvent) {
		this.open = false;

		document.body.removeEventListener('click', this._documentBodyClickHandle);
		document.body.removeEventListener('contextmenu', this._documentBodyClickHandle);

		requestAnimationFrame(() => {
			if (this.parentElement)
				this.parentElement.removeChild(this);
		});
	}

	static get styles() {
		return style;
	}

	render() {
		return html`
			<ul>
				${this.items}
			</ul>
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-menu': MonitorMenu;
	}
}
