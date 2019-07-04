import { LitElement, html, css, customElement, property, CSSResult } from 'lit-element';
import { MonitorAddServerDialog } from './monitor-add-server-dialog';
import { MonitorServerItem } from './monitor-server-item';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-drawer': MonitorDrawer;
	}
}

@customElement('monitor-drawer')
export class MonitorDrawer extends LitElement {

	@property({ type: Array })
	public servers: Array<Server> = [];


	static get styles(): CSSResult {
		return css`
            :host {
                left: 0px;
				min-width: 256px;
                flex-grow: 0;
                display: flex;
                box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
            }

            aside {
				width: 100%;
				display: flex;
				flex-direction: column;
            }

            .add-server {
                margin: 0;
				padding: 20px 15px 15px 15px;
                user-select: none;
                border-bottom: 1px solid silver;
            }

            .add-server > * {
                vertical-align: middle;
                margin: 0 10px 0 0;
                user-select: none;
            }
        `;
	}

	render() {
		return html`
			<aside>
				<div class='add-server' @click="${this.onClicked}">
					<mwc-ripple></mwc-ripple>
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
						<g fill="none" fill-rule="evenodd">
							<path d="M0 0h30v30H0z"></path>
							<circle cx="15" cy="15" r="14" fill="#3B9DFF"></circle>
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

