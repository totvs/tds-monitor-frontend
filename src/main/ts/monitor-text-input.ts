import { LitElement, html, customElement, CSSResult, property, PropertyValues } from 'lit-element';
import { style } from '../css/monitor-text-input.css';

@customElement('monitor-text-input')
export class MonitorTextInput extends LitElement {

	@property({ type: String, reflect: true, attribute: true })
	type: string = 'text';

	@property({ type: String, reflect: true, attribute: true })
	value: string = '';

	@property({ type: String, reflect: true, attribute: true })
	label: string = '';


	constructor() {
		super();

		//this.setAttribute('tabindex', '0');


		this.addEventListener('focus', (event: Event) => {
			this.renderRoot.querySelector('input').focus();
			/*
			event.preventDefault();
			event.stopImmediatePropagation();

			return false;
			*/
		})

	}

	static get styles(): CSSResult {
		return style;
	}

	/*
	firstUpdated(changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		let input = this.renderRoot.querySelector('input');

		this.addEventListener('focus', (event: Event) => {
			input.focus();

			event.preventDefault();
			event.stopImmediatePropagation();

			return false;
		})

		input.addEventListener('blur', (event: Event) => {
			this.blur();
		});
	}
	*/

	/*
	firstUpdated(changedProperties: PropertyValues) {
		super.firstUpdated(changedProperties);

		let input = this.renderRoot.querySelector('input');


		input.addEventListener('blur', (event: Event) => {
			this.blur();
		});


		this.addEventListener('focus', (event: Event) => {
			console.log('focus on host component');

			this.renderRoot.querySelector('input').focus();

			event.preventDefault();
			event.stopImmediatePropagation();

			return false;
		})

		this.renderRoot.querySelectorAll<HTMLElement>("*").forEach(element => {
			element.tabIndex = -1;

			element.addEventListener('focus', (event: Event) => {
				console.log('onfocus', element);

				event.preventDefault();
				event.stopImmediatePropagation();

				return false;
			});
		})
	}
	*/

	render() {
		return html`
			<div class="${this.value === '' ? ' is-empty' : ''}">
				<input type="${this.type}" value="${this.value}" @change="${this.onInputChanged}" @keydown="${this.onInputKeyDown}" tabindex="-1" />
				<label>${this.label}</label>
				<hr />
			</div>
		`;

		/*
		return html`
				<input type="text" tabindex="-1" value="${this.value}" @change="${this.onChanged}" />
				<label tabindex="-1">${this.label}</label>
				<hr tabindex="-1" />
			</div>
		`;

		return html`
			<div class="mdc-text-field">
				<input type="text" class="mdc-text-field__input" id="text-field-hero-input">
				<div class="mdc-line-ripple"></div>
				<label for="text-field-hero-input" class="mdc-floating-label">Name</label>
			</div>
		`;
		*/
	}


	onInputChanged(event: Event) {
		this.value = (event.target as HTMLInputElement).value;
	}

	onInputKeyDown(event: KeyboardEvent) {
		console.log(event);

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

