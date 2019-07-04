import { LitElement, html, customElement, property, css } from 'lit-element';
import { MonitorMenuItem, MenuItemOptions } from './monitor-menu-item';

export interface MenuOptions {
	position: MenuOptionsPosition
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

		if (options.items) {
			this.items = options.items.map(item => new MonitorMenuItem(item));
		}
	}

	setPostition() {
		const position = this.options.position || {};

		if ((position.x !== undefined) && (position.y !== undefined)) {
			this.style.top = `${position.y}px`;
			this.style.left = `${position.x}px`;
		}
		else {
			const parent = this.options.parent;

			this.style.top = (parent.offsetTop + parent.offsetHeight) + 'px';
			this.style.left = (parent.offsetLeft + parent.offsetWidth - this.clientWidth) + 'px';
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
		return css`
			:host {
				z-index: 99999;
				position: absolute;
				background-color: white;
				box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
				transition: opacity .03s linear,transform .12s cubic-bezier(0,0,.2,1),-webkit-transform .12s cubic-bezier(0,0,.2,1);
				will-change: transform,opacity;
				transform-origin: top left;
				opacity: 0.01;
				margin: 0;
				padding: 0;
			}

			:host([open]) {
				display: inline-block;
				transform: scale(1);
				opacity: 1;
			}

			ul {
				padding: 8px 0;
				margin: 0;
			}
		`;
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
