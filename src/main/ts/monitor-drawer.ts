import { LitElement, html, customElement, property, CSSResult } from 'lit-element';
import { MonitorAddServerDialog } from './monitor-add-server-dialog';
import { MonitorServerItem, MonitorServerItemOptions } from './monitor-server-item';
import { style } from '../css/monitor-drawer.css';
import { MonitorSettingsDialog } from './monitor-settings-dialog';
import { MonitorMenu, MenuOptions } from './monitor-menu';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-drawer': MonitorDrawer;
	}
}

@customElement('monitor-drawer')
export class MonitorDrawer extends LitElement {

	//@property({ type: Array })
	//public servers: Array<MonitorServerItemOptions> = [];

	addServer(s: MonitorServerItemOptions) {
		let item = new MonitorServerItem(s);

		this.appendChild(item);
	}

	removeServer(serverName: string) {
		this.querySelectorAll<MonitorServerItem>(`[name="${serverName}"]`).forEach(item => {
			this.removeChild(item);
		});
	}


	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<aside>
				<div class='add-server' @click="${this.onButtonAddServerClicked}">
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
				<slot></slot>
				<footer>
					<monitor-button icon='settings' @click="${this.onButtonSettingsClicked}">Configurações</monitor-button>
					<mwc-icon-button icon='more_vert' @click="${this.onMenuClick}"></mwc-icon-button>
				</footer>
			</aside>
        `;
	}

	onButtonAddServerClicked(event: Event) {
		let dialog = new MonitorAddServerDialog();

		dialog.show();
	}

	onButtonSettingsClicked(event: Event) {
		let dialog = new MonitorSettingsDialog();

		dialog.show();
	}

	onMenuClick(event: MouseEvent) {
		let menu: MonitorMenu,
			options: MenuOptions = {
				parent: event.target as HTMLElement,
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				items: [
					{
						text: 'Recarregar pagina',
						callback: () => window.reload()
					},
					{
						text: 'Ferramentas do desenvolvedor',
						callback: () => window.toggleDevTools()
					}

				]
			};


		menu = new MonitorMenu(options);

		menu.open = true;
	}
}

