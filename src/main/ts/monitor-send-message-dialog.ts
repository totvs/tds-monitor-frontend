import { MonitorUser, TdsMonitorServer } from '@totvs/tds-languageclient';
import { CSSResult, customElement, html, property } from 'lit-element';
import { style } from '../css/monitor-send-message-dialog.css';
import { MonitorButton } from './monitor-button';
import { MonitorDialog, ProgressOption } from './monitor-dialog';
import { MonitorTextInput } from './monitor-text-input';

@customElement('monitor-send-message-dialog')
export class MonitorSendMessageDialog extends MonitorDialog {
	
	// Tira acento proveniente do UTF-8, não compativel com o ANSI
	decode(text: String) {
		return text.split("").map(function(c) {
			var n = c.charCodeAt(0);

			// console.log(n)
			switch (n) {
				case 192: return 'A';
				case 193: return 'A';
				case 194: return 'A';
				case 195: return 'A';
				case 196: return 'A';
				case 197: return 'A';
				case 199: return 'C';
				case 200: return 'E';
				case 201: return 'E';
				case 202: return 'E';
				case 203: return 'E';
				case 204: return 'I';
				case 205: return 'I';
				case 206: return 'I';
				case 207: return 'I';
				case 208: return 'D';
				case 209: return 'N';
				case 210: return 'O';
				case 211: return 'O';
				case 212: return 'O';
				case 213: return 'O';
				case 214: return 'O';
				case 216: return 'O';
				case 217: return 'U';
				case 218: return 'U';
				case 219: return 'U';
				case 220: return 'U';
				case 224: return 'a';
				case 225: return 'a';
				case 226: return 'a';
				case 227: return 'a';
				case 228: return 'a';
				case 229: return 'a';
				case 231: return 'c';
				case 232: return 'e';
				case 233: return 'e';
				case 234: return 'e';
				case 235: return 'e';
				case 236: return 'i';
				case 237: return 'i';
				case 238: return 'i';
				case 239: return 'i';
				case 240: return 'e';
				case 241: return 'n';
				case 242: return 'o';
				case 243: return 'o';
				case 244: return 'o';
				case 245: return 'o';
				case 246: return 'o';
				case 248: return 'o';
				case 249: return 'u';
				case 250: return 'u';
				case 251: return 'u';
				case 252: return 'u';
				case 253: return 'y';
				case 255: return 'y';
				case 296: return 'I';
				case 297: return 'i';
				case 352: return 'S';
				case 353: return 's';
				case 360: return 'U';
				case 361: return 'u';
				case 376: return 'Y';
				case 381: return 'Z';
				case 382: return 'z';
				case 7868: return 'E';
				case 7869: return 'e';

				// Caracteres Fn
				case 170: return 'a' // ª
				case 185: return '1' // ¹ 
				case 178: return '2' // ²
				case 179: return '3' // ³
				case 163: return 'L' // £
				case 162: return 'c' // ¢
				case 172: return '' // ¬
				case 167: return '' // §
				
				default: return c;
			}
		}).join("");
	};

	get message(): string {
		let message = this.renderRoot.querySelector<MonitorTextInput>('#message').value;
		return this.decode(message)
	}

	@property({ type: String, reflect: true, attribute: true })
	get progress(): ProgressOption {
		return super.progress;
	}
	set progress(value: ProgressOption) {
		super.progress = value;
	}

	server: TdsMonitorServer;
	users: Array<MonitorUser>;

	constructor(server: TdsMonitorServer, users: Array<MonitorUser>) {
		super({
			escClose: true,
			buttons: [
				{
					text: 'Enviar',
					click: (event) => this.onOkButtonClicked(event)
				},
				{
					text: 'Cancelar',
					click: (event) => this.onCancelButtonClicked(event)
				}
			]
		});

		this.title = 'Enviar Mensagem';
		this.progress = 'hidden';
		this.server = server;
		this.users = users;
	}

	get body() {
		return html`
			<monitor-text-input id="message" tabindex="1" type="textarea"></monitor-text-input>
		`;
	}


	static get styles(): CSSResult {
		return style;
	}

	blockControls(block: boolean) {
		this.renderRoot.querySelectorAll<MonitorTextInput>('monitor-text-input')
			.forEach((element => {
				element.disabled = block;
			}));

		this.renderRoot.querySelectorAll<MonitorButton>('monitor-button')
			.forEach((element => {
				element.disabled = block;
			}));
	}

	onOkButtonClicked(event: Event) {
		this.blockControls(true);
		this.progress = 'visible';

		//Validar inputs aqui
		if (this.message.length == 0) {
			// alert ou outro modal com o erro ???
			return;
		}

		let progressbar = this.renderRoot.querySelector('monitor-linear-progress'),
			step = 1 / this.users.length;

		progressbar.indeterminate = false;
		progressbar.progress = 0;

		this.users.forEach((user) => {
			//console.log(user.username + " :: " + user.computerName + " :: " + user.threadId + " :: " + user.server + " :: " + this.message);
			this.server.sendUserMessage(user.username, user.computerName, user.threadId, user.server, this.message);

			progressbar.progress += step;
		})

		this.blockControls(false);
		this.progress = 'hidden';
		this.close();
	}

	onCancelButtonClicked(event: Event) {
		this.cancel();
	}

}

