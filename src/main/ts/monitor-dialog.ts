import { LitElement, html, property, customElement, CSSResult } from 'lit-element';
import { style } from '../css/monitor-dialog.css';
import { ButtonOptions, MonitorButton } from './monitor-button';

declare type ProgressOption = 'hidden' | 'visible' | 'none'

interface DialogOptions {
	buttons?: Array<ButtonOptions>;
	escClose?: boolean;
	progress?: ProgressOption;
}



@customElement('monitor-dialog')
export class MonitorDialog extends LitElement {

	buttons: Array<MonitorButton> = null;
	options: DialogOptions = null;

	@property({ type: String, reflect: true, attribute: true })
	get progress(): ProgressOption {
		return this.options ? this.options.progress : null;
	}
	set progress(value: ProgressOption) {
		const oldValue = this.options.progress;
		this.options.progress = value;

		this.requestUpdate('progress', oldValue);
	}

	constructor(options: DialogOptions) {
		super();

		this.options = Object.assign({
//			progress: 'none'
			buttons: []
		}, options);

		this.buttons = this.options.buttons.map(button => new MonitorButton(button));

//		this.progress = this.options.progress;
	}

	static get styles(): CSSResult {
		return style;
	}

	//				${this.options.progress !== 'none' ? html`<monitor-linear-progress ${this.options.progress}></monitor-linear-progress>` : html``}


	render() {
		return html`
			<dialog @cancel="${this.onCancel}">
				<header>
					<h1>${this.title}</h1>
				</header>
				<monitor-linear-progress></monitor-linear-progress>
				<main>
					<slot></slot>
				</main>
				<footer>
					${this.buttons}
				</footer>
			</dialog>
        `;
	}

	public show(): void {
		document.body.appendChild(this);

		requestAnimationFrame(() => {
			let d = this.renderRoot.querySelector('dialog');

			if (d)
				d.show();
		});
	}

	public close(): void {
		//let dialog = this.renderRoot.querySelector('dialog');

		requestAnimationFrame(() => {
			if (this.parentElement)
				this.parentElement.removeChild(this);
		});
	}

	onCancel(event: Event) {
		if (this.options.escClose)
			this.close();

		return false;
	}
}

