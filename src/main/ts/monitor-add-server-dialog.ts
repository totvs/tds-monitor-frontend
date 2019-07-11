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
			<dialog>
			<div class="mainContainer">
			<div class="formWrap" style="background-image: none;">

				<form class="formServer" name="form_server" id="form_server">
					<div class="logo">
						<span class="formTitle">New Server</span><!--New Server-->
					</div>

					<div class="wrap-input">
						<input class="inputText input-serverName" type="text" id="nameID" name="serverName" placeholder="Server Name" required> <!--Server Name-->
						<span class="focus-input fi-serverName">
						</span>
					</div>

					<div class="wrap-input">
						<input class="inputText input-address" type="text" id="addressID" name="address" placeholder="Address" required>  <!--Address-->
						<span class="focus-input fi-address">
						</span>
					</div>

					<div class="wrap-input">
						<input class="inputText input-port" type="number" id="portID" name="port" pattern="[0-9]{5}" placeholder="Port" required> <!--Port-->
						<span class="focus-input fi-port">
						</span>
					</div>

					<div class="wrap-submit">
						<button class="btn-submit" id="submitID" type="button" value="Save" @click="${this.onSaveClicked}">Save</button> <!--Save-->
						<button class="btn-submit" id="submitID" type="button" value="Save and Close" @click="${this.onSaveCloseClicked}">Save and Close</button> <!--Save/Close-->
					</div>
				</form>
			</div>
			</div>
			</dialog>
        `;
	}

	onSaveClicked(event: Event) {
		let serverName = this.renderRoot.querySelector<HTMLInputElement>('#nameID');
		let address = this.renderRoot.querySelector<HTMLInputElement>('#addressID');
		let port = this.renderRoot.querySelector<HTMLInputElement>('#portID');

		let newServer: Server = { name: serverName.value, address: address.value, port: Number(port.value) };

		const app = document.querySelector('monitor-app')
		app.settings.servers.push(newServer);

		console.log(app.settings)
	}

	onSaveCloseClicked(event: Event) {
		console.log(event)
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

