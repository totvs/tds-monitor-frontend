import '@babel/polyfill';
import '@webcomponents/webcomponentsjs';

import './monitor-app';
import './monitor-app-bar';
import './monitor-body';
import './monitor-drawer';
import './monitor-add-server-dialog';
import './monitor-text-input';
import './monitor-user-list';
import './monitor-ripple';
import './monitor-linear-progress';
import './monitor-button';
import './monitor-checkbox';

import { TdsLanguageClient } from '@totvs/tds-languageclient';

declare global {
	let languageClient: TdsLanguageClient;
}

const app = document.querySelector('monitor-app'),
	settings = window.localStorage.getItem('settings');

if (settings) {
	app.settings = JSON.parse(settings);
}
else {
	app.settings = {
		"servers": [
			{
				name: "Production",
				address: "LOCALHOST",
				port: 5555,
				build: '7.00.170117A'
			},
			{
				name: "LOBO-GUARA",
				address: "192.168.168.1",
				port: 6000,
				build: '7.00.170117A'
			}
		]
	}
}

