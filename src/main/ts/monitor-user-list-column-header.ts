//import { MonitorUser } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-user-list-column-header.css';

export enum SortOrder {
	Undefined = 'undefined',
	Ascending = 'ascending',
	Descending = 'descending'
}

@customElement('monitor-user-list-column-header')
export class MonitorUserListColumnHeader extends LitElement {

	@property({ type: String, reflect: true, attribute: true })
	order: SortOrder = SortOrder.Undefined;

	@property({ type: String, reflect: true, attribute: true })
	caption: string = '';

	constructor() {
		super();

		this.addEventListener('click', this.onClick);
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		//const icon = this.order == SortOrder.Descending ? 'arrow_drop_up' : 'arrow_drop_down';

		return html`
			<div>
				<label>${this.caption}</label>
				<i>arrow_downward</i>
			</div>
        `;
	}

	onClick(event: MouseEvent) {
		if (this.order === SortOrder.Descending)
			this.order = SortOrder.Ascending;
		else
			this.order = SortOrder.Descending;


		this.dispatchEvent(new HeaderClickEvent(this.id as ColumnKey, this.order));
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

