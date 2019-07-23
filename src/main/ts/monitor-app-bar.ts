import { html, CSSResult, property, customElement, LitElement } from 'lit-element';
import { MonitorMenu, MenuOptions } from './monitor-menu';
import { style } from '../css/monitor-app-bar.css';


@customElement('monitor-app-bar')
export class MonitorAppBar extends LitElement {

	@property({ type: String })
	public text: string = 'TOTVS Monitor';

	constructor() {
		super();
	}

	static get styles(): CSSResult {
		return style;
  	}

	render() {
		return html`
			<header>
				<img class="logo" src='./totvs_h_neg_pb_optimized.svg' height="36" width="36" />
				<h1>${this.text}</h1>
				<div class="menu">
					<monitor-ripple unbounded dark></monitor-ripple>
					<img src='./more_vert.svg' height="36" width="36" @click="${this.onMenuClick}" />
				</div>
			</header>
        `;
	}

	onMenuClick(event: MouseEvent) {
		let menu: MonitorMenu,
			options: MenuOptions = {
				parent: event.target as HTMLElement,
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
