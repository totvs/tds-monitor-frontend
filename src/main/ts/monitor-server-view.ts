import { LitElement, html, customElement, CSSResult, TemplateResult } from 'lit-element';
import { style } from '../css/monitor-server-view.css';
import { MonitorUser } from '@totvs/tds-languageclient';
import { MonitorUserListStatus } from './monitor-user-list';

@customElement('monitor-server-view')
export class MonitorServerView extends LitElement {

	set users(value: MonitorUser[]) {
		this.renderRoot.querySelector('monitor-user-list').users = value;
	};

	set name(value: string) {
		this.renderRoot.querySelector('monitor-user-list').name = value;
	};

	set status(value: MonitorUserListStatus) {
		this.renderRoot.querySelector('monitor-user-list').status = value;
	};

	set error(value: string) {
		this.renderRoot.querySelector('monitor-user-list').error = value;
	};


	constructor() {
		super();
	}

	static get styles(): CSSResult {
		return style;
	}

	render(): TemplateResult {

		/*
			<header>
				<h1>${'this.name'}</h1>
				<h2>${'this.address'}:${'this.port'}</h2>
			</header>
		*/
		return html`
			<div>
				<span class='connecting-message'>Conectando ao servidor ${this.name}</span>
				<span class='error-message'>${this.error}</span>
			</div>
			<monitor-user-list></monitor-user-list>
			<footer></footer>;
		`;
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-view': MonitorServerView;
	}
}
