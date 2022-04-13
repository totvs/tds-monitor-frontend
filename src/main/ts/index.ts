import "core-js/stable";
import "regenerator-runtime/runtime";
import "@webcomponents/webcomponentsjs";

import "@material/mwc-button";
import "@material/mwc-checkbox";
import "@material/mwc-icon";
import "@material/mwc-icon-button";
import "@material/mwc-linear-progress";
import "@material/mwc-ripple";
import "@material/mwc-switch";

import "./monitor-add-server-dialog";
import "./monitor-app";
import "./monitor-app-bar";
import "./monitor-body";
import "./monitor-button";
import "./monitor-checkbox";
import "./monitor-drawer";
import "./monitor-linear-progress";
import "./monitor-log-view";
import "./monitor-main";
import "./monitor-radio";
import "./monitor-ripple";
import "./monitor-server-view";
import "./monitor-text-input";
import "./monitor-user-list";
import "./monitor-user-list-row";
import "./monitor-user-list-column-header";
import "./monitor-warning";

import { TdsLanguageClient } from "@totvs/tds-languageclient";

declare global {
	let languageClient: TdsLanguageClient;
}

const app = document.querySelector("monitor-app"),
	settings = window.storage.get();

if (settings) {
	app.settings = checkServerIds(settings);
}

function checkServerIds(settings: MonitorSettings) {
	let settingsServers = settings ? (settings.servers ? settings.servers : []) : [];
	let servers: Array<MonitorSettingsServer> =
		settingsServers.map<MonitorSettingsServer>((server) => {
			if (!server.serverId) {
				server.serverId = Math.random().toString(36).substring(3);
			}
			if (!server.token) {
				server.token = "";
			}
			return server;
		});
	return Object.assign<MonitorSettings, MonitorSettings>(settings, {
		servers,
	});
}
