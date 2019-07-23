import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-text-input.css';

@customElement('monitor-text-input')
export class MonitorTextInput extends LitElement {

	@property({ type: String, reflect: true, attribute: true })
	type: string = 'text';

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
		// let min = html`${((this.type === 'number') && (this.min !== null)) ? 'min="${this.min}"' : ''}`,
		// max = html`${((this.type === 'number') && (this.max !== null)) ? 'max="${this.max}"' : ''}`;

		//max = ((this.type === 'number') && (this.max !== null)) ? html`min="${this.max}"` : '';

		let min = (this.type === 'number') ? this.min : null,
			max = (this.type === 'number') ? this.max : null;

		//				${min !== null ? html`min="${min}"` : ''}
		//${max !== null ? html`max="${max}"` : ''}

		return html`
			<div class="${this.value === '' ? 'is-empty' : ''}">
				${this.icon ? html`<mwc-icon-button icon="${this.icon}"></mwc-icon-button>` : ''}
				${this.type !== 'textarea' ? html`
				<input type="${this.type}" .value="${this.value}" ?disabled=${this.disabled} @change="${this.onInputChanged}" @keydown="${this.onInputKeyDown}"
				 min=${min} max=${max} tabindex="0" />
				` : html`
				<textarea .value="${this.value}" ?disabled=${this.disabled} @change="${this.onInputChanged}" @keydown="${this.onInputKeyDown}"
				 tabindex="0" />
				`}
							<label>${this.label}</label>
							${this.outlined ? '' : html`<hr />`}
						</div>
		`;
	}


	showRedLine(fieldContent: string, fieldType: string) {
		var oldLabel = this.label;
		this.renderRoot.querySelector('div').classList.add('invalid');
		this.label = fieldContent;
		this.type = fieldType;

		setTimeout(() => {
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

		this.renderRoot.querySelector('div').classList.remove('invalid');
	}

}

