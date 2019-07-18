import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-text-input.css';

@customElement('monitor-text-input')
export class MonitorTextInput extends LitElement {

	@property({ type: String, reflect: true, attribute: true })
	type: string = 'text';

	@property({ type: String, reflect: true, attribute: true })
	value: string = '';

	@property({ type: String, reflect: true, attribute: true })
	label: string = '';

	@property({ type: Boolean, reflect: true, attribute: true })
	disabled: boolean = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	outlined: boolean = false;

	@property({ type: String, reflect: true, attribute: true })
	icon: string = '';

	createRenderRoot() {
		return this.attachShadow({ mode: 'open', delegatesFocus: true });
	}

	constructor() {
		super();

		//this.setAttribute('tabindex', '0');

		this.addEventListener('focus', (event: Event) => {
			this.renderRoot.querySelector('input').focus();
		})

	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<div class="${this.value === '' ? ' is-empty' : ''}">
				${this.icon !== '' ? html`<mwc-icon-button icon="${this.icon}"></mwc-icon-button>` : ''}
				${this.type !== 'textarea' ? html`
				<input type="${this.type}" .value="${this.value}" ?disabled=${this.disabled} @change="${this.onInputChanged}" @keydown="${this.onInputKeyDown}"
				 tabindex="0" />
				 ` : html`
				 <textarea .value="${this.value}" ?disabled=${this.disabled} @change="${this.onInputChanged}" @keydown="${this.onInputKeyDown}"
				 tabindex="0" />
				`}
				<label>${this.label}</label>
				${this.outlined ? '' : html`<hr />`}
			</div>
		`;
	}


	onInputChanged(event: Event) {
		this.value = (event.target as HTMLInputElement).value;
	}

	onInputKeyDown(event: KeyboardEvent) {
		switch (event.key.toUpperCase()) {
			case 'TAB':
				this.focus();
				break;
			case 'ESCAPE':
				this.dispatchEvent(new Event('cancel', {
					bubbles: true,
					composed: true
				}));

				break;
		}
	}

}

