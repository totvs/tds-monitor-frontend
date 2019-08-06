import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-text-input.css';

@customElement('monitor-text-input')
export class MonitorTextInput extends LitElement {

	@property({ type: String, reflect: true, attribute: true })
	type: string = 'text';

	@property({ type: String, reflect: true, attribute: true })
	classValue: string = '';

	@property({ type: String, reflect: true, attribute: true })
	value: string = '';

	@property({ type: String, reflect: true, attribute: true })
	label: string = null;

	@property({ type: Boolean, reflect: true, attribute: true })
	disabled: boolean = false;

	@property({ type: Boolean, reflect: true, attribute: true })
	outlined: boolean = false;

	@property({ type: String, reflect: true, attribute: true })
	icon: string = null;

	@property({ type: Number, reflect: true, attribute: true })
	min: number = null;

	@property({ type: Number, reflect: true, attribute: true })
	max: number = null;

	createRenderRoot() {
		return this.attachShadow({ mode: 'open', delegatesFocus: true });
	}

	constructor() {
		super();

		//this.setAttribute('tabindex', '0');

		this.addEventListener('focus', (event: Event) => {
			this.renderRoot.querySelector<HTMLInputElement | HTMLTextAreaElement>('input, textarea').focus();
		})

	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		let min = (this.type === 'number') ? this.min : null,
			max = (this.type === 'number') ? this.max : null;


		return html`
			<div class="${this.classValue === '' ? '' : ' is-empty invalid'}">
				${this.icon ? html`<mwc-icon>${this.icon}</mwc-icon>` : ''}
				${this.type !== 'textarea' ? html`
				<input
					type="${this.type}"
					.value="${this.value}"
					?disabled=${this.disabled}
					@change="${this.onInputChanged}"
					@input="${this.onInputInput}"
					@keydown="${this.onInputKeyDown}"
					min=${min}
					max=${max}
				 	tabindex="0" />
				 ` : html`
				 <textarea .value="${this.value}" ?disabled=${this.disabled} @change="${this.onInputChanged}" @input="${this.onInputInput}" @keydown="${this.onInputKeyDown}"
				 tabindex="0" />
				`}
				<label>${this.label}</label>
				${this.outlined ? '' : html`<hr />`}
			</div>
		`;
	}

	showRedLine(fieldContent: string, fieldType: string){
		var oldClassValue = this.classValue;
		var oldLabel = this.label;
		this.classValue = 'error'
		this.label = fieldContent;
		this.type = fieldType;

		setTimeout( () => {
			this.classValue = oldClassValue;
			this.label = oldLabel;
		}, 3000);
	}

	onInputChanged(event: Event) {
		this.value = (event.target as HTMLInputElement).value;

		//this.dispatchEvent(new Event(event.type, event));
	}

	onInputInput(event: Event) {
		this.value = (event.target as HTMLInputElement).value;

		//this.dispatchEvent(new Event(event.type, event));
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
		//this.value = '';
		//this.classValue = '';
	}

}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-text-input': MonitorTextInput;
	}
}

