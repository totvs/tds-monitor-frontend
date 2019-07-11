import { LitElement, html, customElement, CSSResult } from 'lit-element';
import { style } from '../css/monitor-add-server-dialog.css';

@customElement('monitor-add-server-dialog')
export class MonitorAddServerDialog extends LitElement {

	static get styles(): CSSResult {
		return style;
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

