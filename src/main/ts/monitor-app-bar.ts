import { css, html, CSSResult, property, customElement, LitElement } from 'lit-element';


@customElement('monitor-app-bar')
export class MonitorAppBar extends LitElement {

    @property({type: String})
    public text: string = 'TOTVS Monitor';

    constructor() {
        super();
    }

    static get styles(): CSSResult {
        return css`
            :host {
                height: 64px;
				z-index: 1000;
            }
			header {
				-webkit-app-region: drag;
				-webkit-user-select: none;
				z-index: 1000;
				min-height: 56px;
				box-shadow: 0 2px 4px -1px rgba(0,0,0,.2), 0 4px 5px 0 rgba(0,0,0,.14), 0 1px 10px 0 rgba(0,0,0,.12);
				color: #f5f5f5;
				background-color: #3d3d3d;
				background-image: linear-gradient(#000,#3d3d3d);
				padding: 6px 12px;
				display: flex;
				align-items: center;
				height: 100%;
				box-sizing: border-box;
			}

			h1 {
				margin: 0;
				font-size: 26px;
			}

			img {
				margin: 12px;
			}
		`;
    }

    render() {
		return html`
			<header>
				<img src='./totvs_h_neg_pb_optimized.svg' height="36" width="36" />
				<h1>${this.text}</h1>
			</header>
        `;
    }

}
