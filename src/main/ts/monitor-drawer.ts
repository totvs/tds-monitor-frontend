import { LitElement, html, customElement, property, CSSResult } from 'lit-element';
import { MonitorAddServerDialog } from './monitor-add-server-dialog';
import { MonitorServerItem, MonitorServerItemOptions } from './monitor-server-item';
import { style } from '../css/monitor-drawer.css';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-drawer': MonitorDrawer;
	}
}

@customElement('monitor-drawer')
export class MonitorDrawer extends LitElement {

	@property({ type: Array })
	public servers: Array<MonitorServerItemOptions> = [];


	static get styles(): CSSResult {
		return style;
	}
//azul 3B9DFF
	render() {
		return html`
			<aside>
				<div class='add-server' @click="${this.onClicked}">
					<monitor-ripple></monitor-ripple>
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
						<g fill="none" fill-rule="evenodd">
							<path d="M0 0h30v30H0z"></path>
							<circle cx="15" cy="15" r="14" fill="#EA9B3E"></circle>
							<rect width="14" height="2" x="8" y="14" fill="#FFF" rx="1"></rect>
							<rect width="2" height="14" x="14" y="8" fill="#FFF" rx="1"></rect>
						</g>
					</svg>
					<label>Novo Servidor</label>
				</div>
				${this.servers.map(s => new MonitorServerItem(s))}
			</aside>
        `;
	}


	onClicked(event: Event) {
		let dialog = new MonitorAddServerDialog();

		dialog.show();
	}
}

