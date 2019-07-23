import { LitElement, html, customElement, property  } from 'lit-element';
import { style } from '../css/monitor-warning.css'

// import { LitElement, html, customElement, } from 'lit-element';
// import { style } from '../css/monitor-text-input.css';

@customElement('monitor-warning')
export class MonitorWarning extends LitElement {
	// showError: string;
	// msg: String;
	@property({ type: String, reflect: true, attribute: true })
	msg: string = '';

	@property({ type: String, reflect: true, attribute: true })
	showError: string = '';

	static get properties(){
		return {
			msg: {Type: String,},
			showError: {Type: String}
		};
	}

	static get styles() {
		return style;
	}

	render() {
		return html`
		<div class="${this.showError === 'no' ? '' : 'visible'} ">
			${this.msg}
		</div>
		`;
	}

	showTheError(message: string){
		this.msg = message;
		this.showError = 'yes';
		setTimeout( () => this.showError = 'no', 3000);

	}

	hideTheError(){
		this.showError = 'no'
	}
}

