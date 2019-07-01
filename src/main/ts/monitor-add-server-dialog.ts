import { LitElement, html, css, customElement, CSSResult } from 'lit-element';

@customElement('monitor-add-server-dialog')
export class MonitorAddServerDialog extends LitElement {

	static get styles(): CSSResult {
		return css`
            :host {
				z-index: -1;
				display: flex;
				overflow: hidden;
				margin: 0;
				padding: 0;
				border: 0;
				position: fixed;
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				background-color: transparent;
				justify-content: center;
				align-items: center;
			}

			dialog {
				flex-grow: 1;
				display: flex;
				color: black;
				background-color: white;
				border: none;
				box-shadow: 0 9px 46px 8px rgba(0, 0, 0, 0.14), 0 11px 15px -7px rgba(0, 0, 0, 0.12), 0 24px 38px 3px rgba(0, 0, 0, 0.2);
				padding: 0;

				-webkit-transition: opacity .15s, transform .15s;
				-moz-transition: opacity .15s, transform .15s;
				transition: opacity .15s, transform .15s;

				-webkit-transform: scale(1);
				-moz-transform: scale(1);
				-ms-transform: scale(1);
				transform: scale(1);
				opacity: 1;
			}


			dialog.maximized {
				top: 0;
				left: 0;
				bottom: 0;
				right: 0;
				height: auto;
				width: auto;
			}

			dialog::backdrop, dialog + .backdrop {
				background-color: transparent;
			}

			dialog.hidden {
				-webkit-transform: scale(0.7);
				-moz-transform: scale(0.7);
				-ms-transform: scale(0.7);
				transform: scale(0.7);
				opacity: 0;
			}
        `;
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

