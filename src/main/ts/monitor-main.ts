import { LitElement, html, customElement, CSSResult, TemplateResult } from 'lit-element';
import { style } from '../css/monitor-main.css';

@customElement('monitor-main')
export class MonitorMain extends LitElement {

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

