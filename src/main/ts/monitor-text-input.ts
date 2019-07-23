import { LitElement, html, customElement, CSSResult, property } from 'lit-element';
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
	label: string = '';

	@property({ type: Boolean, reflect: true, attribute: true })
	disabled: boolean = false;

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
			<div class="${this.classValue === '' ? '' : ' is-empty invalid'}">
				<input type="${this.type}" .value="${this.value}" ?disabled=${this.disabled} @change="${this.onInputChanged}" @keydown="${this.onInputKeyDown}"
				 tabindex="0" />
				<label>${this.label}</label>
				<hr />
			</div>
		`;
	}


	showRedLine(fieldContent: string, fieldType: string){
		var oldLabel = this.label;
		this.classValue = 'error'
		this.label = fieldContent;
		this.type = fieldType;

		setTimeout( () => {
			this.label = oldLabel;
		}, 3000);
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
		this.classValue = ''
	}

}

