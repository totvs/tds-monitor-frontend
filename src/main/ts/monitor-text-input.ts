import { LitElement, html, customElement, CSSResult } from 'lit-element';
import { style } from '../css/monitor-text-input.css';

@customElement('monitor-text-input')
export class MonitorTextInput extends LitElement {

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<div class="mdc-text-field">
				<input class="mdc-text-field__input" id="text-field-hero-input">
				<div class="mdc-line-ripple"></div>
				<label for="text-field-hero-input" class="mdc-floating-label">Name</label>
			</div>
        `;
	}

}

