import { LitElement, html, customElement, CSSResult, TemplateResult } from 'lit-element';
import { style } from '../css/monitor-body.css';

@customElement('monitor-body')
export class MonitorBody extends LitElement {

	constructor() {
		super();
	}

	static get styles(): CSSResult {
		return style;
	}

	render(): TemplateResult {
		return html`
			<slot></slot>
        `;
	}



}

