import {
	BuildVersion,
	MonitorUser,
	TdsMonitorServer,
} from "@totvs/tds-languageclient";
import {
	CSSResult,
	customElement,
	html,
	LitElement,
	property,
} from "lit-element";
import { style } from "../css/monitor-server-item.css";
import { monitorIcon } from "./icon-monitor-svg";
import { MonitorConnectionDialog } from "./monitor-connection-dialog";
import { MonitorAuthenticationDialog } from "./monitor-authentication-dialog";
import { MenuOptions, MonitorMenu } from "./monitor-menu";
import { MonitorOtherActionsDialog } from "./monitor-other-actions-dialog";
import { MonitorEditServerDialog } from "./monitor-edit-server-dialog";
import { MonitorConfirmationDialog } from "./monitor-confirmation-dialog";
import { i18n } from "./util/i18n";

declare global {
	interface HTMLElementTagNameMap {
		"monitor-server-item": MonitorServerItem;
	}
}

declare type ConnectionStatus =
	| "disconnected"
	| "connecting"
	| "connected"
	| "error";

export interface MonitorServerItemOptions {
	serverId: string;
	name: string;
	server: TdsMonitorServer;
	users?: MonitorUser[];
}

@customElement("monitor-server-item")
export class MonitorServerItem extends LitElement {
	@property({ type: String, reflect: true, attribute: true })
	serverId: string;

	@property({ type: String, reflect: true, attribute: true })
	name: string;

	@property({ type: String })
	address: string;

	@property({ type: Number })
	port: number;

	build: BuildVersion;

	environment: string;

	user: string;

	password: string;

	@property({ type: String })
	status: ConnectionStatus = "disconnected";

	@property({ type: Boolean })
	enableNewConnections: boolean = true;

	server: TdsMonitorServer = null;

	constructor(options: MonitorServerItemOptions) {
		super();

		this.serverId = options.serverId;

		this.server = options.server;

		this.name = options.name;
		this.address = this.server.address;
		this.port = this.server.port;
		this.build = this.server.build;
	}

	static get styles(): CSSResult {
		return style;
	}

	async disconnectServer(): Promise<boolean> {
		this.server.disconnect();

		this.status = "disconnected";

		return true;
	}

	async connectServer(dispatchEvents?: boolean): Promise<boolean> {
		console.log("connectServer");
		let connectionFailed = false;
		this.status = "connecting";

		if (dispatchEvents) {
			this.dispatchEvent(
				new CustomEvent<MonitorServerItemOptions>("server-init", {
					detail: {
						serverId: this.serverId,
						name: this.name,
						server: this.server,
						users: [],
					},
					bubbles: true,
					composed: true,
				})
			);
		}

		if (this.server.token !== null) {
			let result = await this.server.reconnect({ encoding: "CP1252" });

			if (!result) {
				result = await this.server.reconnect({ encoding: "CP1251" });
			}

			if (!result) {
				connectionFailed = true;
				this.server.token = null;
			}
		}

		if (this.server.token == null) {
			let connDialog = new MonitorConnectionDialog(this),
				connResult = await connDialog.showForResult();

			if (connResult) {
				let tryAgainSecure = 2;
				while (tryAgainSecure > 0) {
					connResult = await this.server.connect(
						this.name,
						this.server.serverType,
						this.server.address,
						this.server.port,
						this.server.secure,
						this.build,
						connDialog.environment
					);

					if (connResult) {
						tryAgainSecure = 0;
						let authDialog = new MonitorAuthenticationDialog(this),
							authResult = await authDialog.showForResult();

						if (authResult) {
							// Try to authenticate using latin codepage
							authResult = await this.server.authenticate(
								authDialog.username,
								authDialog.password,
								"CP1252"
							);

							if (!authResult) {
								// Try to authenticate using cyrillic codepage
								await this.server.connect(
									this.name,
									this.server.serverType,
									this.server.address,
									this.server.port,
									this.server.secure,
									this.build,
									connDialog.environment
								);
								authResult = await this.server.authenticate(
									authDialog.username,
									authDialog.password,
									"CP1251"
								);
							}

							if (authResult) {
								if (authDialog.storeToken) {
									const app =
										document.querySelector("monitor-app");
									app.storeConnectionToken(
										this.name,
										this.server.token
									);
								}
							} else {
								connectionFailed = true;
							}
						} else {
							connectionFailed = true;
						}
					} else {
						tryAgainSecure--;
						if (tryAgainSecure > 0) {
							this.server.secure = !this.server.secure;
						} else {
							connectionFailed = true;
						}
					}
				}
			} else {
				connectionFailed = true;
			}
		}

		if (!connectionFailed) {
			this.status = "connected";
		} else {
			this.status = "error";
			this.server.token = null;
			this.server.isConnected = false;

			if (dispatchEvents) {
				this.dispatchEvent(
					new CustomEvent<string>("server-error", {
						detail: i18n.localize(
							"UNABLE_CONNECT",
							"It was not possible to connect to this server."
						),
						bubbles: true,
						composed: true,
					})
				);
			}
		}

		return this.status === "connected";
	}

	async getUsers() {
		//console.log("teste1");
		let users = await this.server.getUsers();

		if (users != null) {
			this.dispatchEvent(
				new CustomEvent<MonitorServerItemOptions>("server-connected", {
					detail: {
						serverId: this.serverId,
						name: this.name,
						server: this.server,
						users: users,
					},
					bubbles: true,
					composed: true,
				})
			);
		} else {
			this.status = "error";

			this.dispatchEvent(
				new CustomEvent<string>("server-error", {
					detail: i18n.localize(
						"UNABLE_CONNECT",
						"It was not possible to connect to this server."
					),
					bubbles: true,
					composed: true,
				})
			);
		}
	}

	render() {
		return html`
			<section
				class="${this.status}"
				@click="${this.onLeftClick}"
				@contextmenu="${this.onRightClick}"
			>
				<monitor-ripple></monitor-ripple>
				${monitorIcon}
				<label>
					<h1>${this.name}</h1>
					<span>${this.address}:${this.port}</span>
				</label>
			</section>
		`;
	}

	async onLeftClick(event: MouseEvent) {
		switch (this.status) {
			case "disconnected":
			case "error":
				let success = await this.connectServer(true);

				if (success) await this.getUsers();

				break;
			case "connecting":
				//Do nothing

				break;
			case "connected":
				await this.getUsers();

				break;
			default:
				break;
		}
	}

	async onRightClick(event: MouseEvent) {
		let menu: MonitorMenu,
			options: MenuOptions = {
				parent: this,
				position: {
					x: event.pageX,
					y: event.pageY,
				},
				items: [],
			};

		if (this.status === "disconnected" || this.status === "error") {
			options.items.push({
				text: i18n.localize("CONNECT", "Connect"),
				separator: true,
				callback: () => {
					this.server.token = null;
					this.connectServer(false);
				},
			});
			options.items.push({
				text: i18n.localize("EDIT_SERVER", "Edit Server"),
				callback: () => {
					this.editServer();
				},
				separator: false,
			});
			options.items.push({
				text: i18n.localize("DELETE_SERVER", "Delete Server"),
				callback: () => {
					this.deleteServer();
				},
				separator: true,
			});
			// options.items.push({
			// 	text: 'Habilitar novas conexões',
			// 	callback: () => { this.setConnectionStatus(true) }
			// });
		} else {
			options.items.push({
				text: i18n.localize("DISCONNECT", "Disconnect"),
				separator: true,
				callback: () => {
					this.disconnectServer();
				},
			});

			if (this.status === "connected") {
				options.items.push({
					text: i18n.localize("OTHER_ACTIONS", "Other actions"),
					callback: () => {
						this.otherActions();
					},
				});
			}
		}

		menu = new MonitorMenu(options);

		menu.open = true;
	}

	editServer() {
		let dialog = new MonitorEditServerDialog(
			this.serverId,
			this.name,
			this.server
		);

		dialog.show();
	}

	deleteServerCallback(params: any) {
		const app = document.querySelector("monitor-app");

		app.removeServer(params.serverId);
	}

	deleteServer() {
		let dialog = new MonitorConfirmationDialog();

		dialog.title = i18n.localize("DELETE_SERVER", "Delete Server");
		dialog.message = i18n.localize(
			"DELETE_SERVER_CONFIRMATION",
			"Are you sure you want to delete this server?"
		);
		dialog.yesCallback = this.deleteServerCallback;
		dialog.callbackParams = { serverId: this.serverId };

		dialog.show();
	}

	onYesButtonClicked() { }

	async otherActions() {
		await this.server
			.getConnectionStatus()
			.then((status) => (this.enableNewConnections = status));

		let dialog = new MonitorOtherActionsDialog(
			this.server,
			this.enableNewConnections
		);

		dialog.show();
	}
}
