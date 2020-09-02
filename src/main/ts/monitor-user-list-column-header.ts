//import { MonitorUser } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-user-list-column-header.css';
import { columnConfig } from './monitor-columns';
import { i18n } from './util/i18n';

export enum SortOrder {
	Undefined = 'undefined',
	Ascending = 'ascending',
	Descending = 'descending'
}

@customElement('monitor-user-list-column-header')
export class MonitorUserListColumnHeader extends LitElement {

	initialX: number = null;
	initialWidth: number = null;

	@property({ type: String, reflect: true, attribute: true })
	id: string = '';

	@property({ type: String, reflect: true, attribute: true })
	order: SortOrder = SortOrder.Undefined;

	@property({ type: String, reflect: true, attribute: true })
	caption: string = '';

	@property({ type: Number, reflect: true, attribute: true })
	width: number = 100;

	constructor() {
		super();
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		let columnWidth = this.width;
		let captionWidth = columnWidth - 24 - 5; // subtract arrow icon width
		return html`
			<div class="clickable" style="width:${columnWidth}px;" @click=${this.onClick}>
				<div class="label" style="width:${captionWidth}px;">
					<label title="${this.caption}">${this.caption}</label>
				</div>
				<i>arrow_downward</i>
			</div>
			<div class="resize" @mousedown="${this.onResizeStart}"></div>
		`;
	}

	onClick(event: MouseEvent) {
		if (this.order === SortOrder.Descending)
			this.order = SortOrder.Ascending;
		else
			this.order = SortOrder.Descending;


		this.dispatchEvent(new HeaderClickEvent(this.id as ColumnKey, this.order));
	}

	onResizeStart(event: MouseEvent) {
		const moveListener = (event: MouseEvent) => this.onResizeMove(event);
		const endListener = (event: MouseEvent) => {
			document.removeEventListener('mousemove', moveListener);
			document.removeEventListener('mouseup', endListener);
			document.removeEventListener('mouseout', endListener);

			return this.onResizeEnd(event);
		};

		document.addEventListener('mousemove', moveListener);
		document.addEventListener('mouseup', endListener);
		document.addEventListener('mouseout', endListener);

		this.initialX = event.clientX;
		this.initialWidth = this.clientWidth;

		document.body.classList.add('resizing-ns');

		return false;
	}

	onResizeMove(event: MouseEvent) {
		let newWidth = this.initialWidth + (event.clientX - this.initialX) - 10;
		this.width = newWidth;
	}

	onResizeEnd(event: MouseEvent) {
		document.body.classList.remove('resizing-ns');

		const app = document.querySelector('monitor-app');
		let columns = columnConfig().map((column) => {
			return {
				id: column.id,
				visible: column.visible,
				align: column.align,
				width: (column.id === this.id) ? this.width : column.width
			}
		});

		app.config = Object.assign<MonitorSettingsConfig, MonitorSettingsConfig>(app.config, {
			columns
		});

		app.dispatchEvent(new CustomEvent<string>('settings-update', {
			detail: i18n.localize("UPDATE_SETTINGS", "Update settings."),
			bubbles: true,
			composed: true
		}));

		return false;
	}

}

interface HeaderClickDetail {
	column: ColumnKey;
	order: SortOrder
}

export class HeaderClickEvent extends CustomEvent<HeaderClickDetail> {
	constructor(id: ColumnKey, order: SortOrder) {
		super('header-click', {
			composed: true,
			bubbles: true,
			detail: {
				column: id,
				order: order
			}
		});
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-user-list-column-header': MonitorUserListColumnHeader;
	}

	interface GlobalEventHandlersEventMap {
		'header-click': HeaderClickEvent;
	}

}

