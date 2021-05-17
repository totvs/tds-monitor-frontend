import { LitElement, html, customElement, CSSResult } from 'lit-element';
import { MonitorAddServerDialog } from './monitor-add-server-dialog';
import { MonitorServerItem, MonitorServerItemOptions } from './monitor-server-item';
import { style } from '../css/monitor-drawer.css';
import { MonitorSettingsDialog } from './monitor-settings-dialog';
import { MonitorMenu, MenuOptions } from './monitor-menu';
import { MonitorAboutDialog } from './monitor-about-dialog';
import { i18n } from './util/i18n';

declare global {
	interface HTMLElementTagNameMap {
		'monitor-drawer': MonitorDrawer;
	}
}

@customElement('monitor-drawer')
export class MonitorDrawer extends LitElement {

	addServer(s: MonitorServerItemOptions) {
		let item = new MonitorServerItem(s);
		// sort
		let before: MonitorServerItem = undefined;
		this.childNodes.forEach((data: MonitorServerItem) => {
			if (!before && item.name.localeCompare(data.name) < 0) {
				before = data;
			}
		});
		if (before) {
			this.insertBefore(item, before);
		}
		else {
			this.appendChild(item);
		}
	}

	editServer(s: MonitorServerItemOptions) {
		this.querySelectorAll<MonitorServerItem>(`[serverId="${s.serverId}"]`).forEach(item => {
			item.server = s.server;

			item.name = s.name;
			item.address = s.server.address;
			item.port = s.server.port;
			item.build = s.server.build;
		});
	}

	removeServer(serverId: string) {
		this.querySelectorAll<MonitorServerItem>(`[serverId="${serverId}"]`).forEach(item => {
			this.removeChild(item);
		});
	}


	static get styles(): CSSResult {
		return style;
	}

	render() {
		return html`
			<aside>
				<header @click="${this.onButtonAddServerClicked}">
					<monitor-ripple></monitor-ripple>
					<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30">
						<g fill="none" fill-rule="evenodd">
							<path d="M0 0h30v30H0z"></path>
							<circle cx="15" cy="15" r="14" fill="#EA9B3E"></circle>
							<rect width="14" height="2" x="8" y="14" fill="#FFF" rx="1"></rect>
							<rect width="2" height="14" x="14" y="8" fill="#FFF" rx="1"></rect>
						</g>
					</svg>
					<label>${i18n.localize("NEW_SERVER", "New Server")}</label>
				</header>
				<slot></slot>
				<footer>
					<monitor-button icon='settings' @click="${this.onButtonSettingsClicked}">${i18n.localize("CONFIGURATIONS", "Configurations")}</monitor-button>
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
		const serverView = document.querySelector('monitor-server-view'),
			options: MenuOptions = {
				parent: event.target as HTMLElement,
				position: {
					my: 'bottom left',
					at: 'top left'
				},
				items: [
					{
						text: serverView.showlog ? i18n.localize("HIDE_LOG", "Hide Log") : i18n.localize("SHOW_LOG", "Show Log"),
						callback: () => { serverView.showlog = !serverView.showlog },
						separator: true
					},
					{
						text: i18n.localize("ABOUT", "About..."),
						callback: () => { this.showAboutDialog() }
					}
				]
			};


		const menu = new MonitorMenu(options);
		menu.open = true;
	}

	showAboutDialog() {
		const dialog = new MonitorAboutDialog();

		dialog.show();
	}

}

