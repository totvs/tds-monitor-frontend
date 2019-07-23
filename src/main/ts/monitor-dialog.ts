import { CSSResult, customElement, html, LitElement, property } from 'lit-element';
import { style } from '../css/monitor-dialog.css';
import { ButtonOptions, MonitorButton } from './monitor-button';

export type ProgressOption = 'hidden' | 'visible' | 'none'

export interface DialogOptions {
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
	}

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<dialog @cancel="${this.onCancel}">
				<header>
					<h1>${this.title}</h1>
				</header>
				<monitor-linear-progress></monitor-linear-progress>
				<main>
					${this.body}
				</main>
				<footer>
					${this.buttons}
				</footer>
			</dialog>
        `;
	}

	get body() {
		return html`
			<slot></slot>
		`;
	}

	public showForResult(): Promise<boolean> {
		return this.show().then(() => this.result())
	}

	public show(): Promise<void> {
		document.body.appendChild(this);

		return new Promise((resolve, reject) => {
			requestAnimationFrame(() => {
				let d = this.renderRoot.querySelector('dialog');

				if (d) {
					d.show();
					resolve();
				}
				else {
					reject();
				}
			});
		});
	}

	public result(): Promise<boolean> {
		return new Promise((resolve, reject) => {
			let listener = (event: CustomEvent<boolean>) => {
				resolve(event.detail);

				this.removeEventListener('dialog-closed', listener);
			}

			this.addEventListener('dialog-closed', listener);
		});
	}

	public close(): void {
		this._close(true);
	}

	public cancel(): void {
		this._close(false);
	}

	private _close(result: boolean): void {
		requestAnimationFrame(() => {
			if (this.parentElement)
				this.parentElement.removeChild(this);

			this.dispatchEvent(new CustomEvent<boolean>('dialog-closed', {
				detail: result,
				bubbles: false
			}));
		});
	}

	onCancel(event: Event) {
		if (this.options.escClose)
			this.cancel();

		return false;
	}
}

