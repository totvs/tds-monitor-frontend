import { LitElement, html, customElement, CSSResult, property } from 'lit-element';
import { style } from '../css/monitor-dialog.css';
import { ButtonOptions, MonitorButton } from './monitor-buton';

interface DialogOptions {
	buttons?: Array<ButtonOptions>;
	escClose?: boolean;
}


@customElement('monitor-dialog')
export class MonitorDialog extends LitElement {

	options: DialogOptions = null;

	constructor(options: DialogOptions) {
		super();

		this.options = Object.assign({}, options);

		this.title = 'Adicionar Novo Servidor';
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
				<main>
					<slot></slot>
				</main>
				<footer>
					${this.options.buttons ? this.options.buttons.map(button => new MonitorButton(button)) : ''}
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

