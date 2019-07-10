import { LitElement, html, customElement, CSSResult } from 'lit-element';
import { style } from '../css/monitor-add-server-dialog.css';

@customElement('monitor-add-server-dialog')
export class MonitorAddServerDialog extends LitElement {

	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<dialog></dialog>
        `;
	}

	public show(): void {
		document.body.appendChild(this);

		setTimeout(() => {
			let d = this.renderRoot.querySelector('dialog');

			console.log(d);
			if (d)
				d.show();

		}, 1);

	}

}

