import { LitElement, html, customElement, property } from 'lit-element';


declare global {
	interface HTMLElementTagNameMap {
		'monitor-server-item': MonitorServerItem;
	}
}

/*extends Drawer*/
@customElement('monitor-server-item')
export class MonitorServerItem extends LitElement {

	@property({type: String})
	name: string;

	@property({type: String})
	address: string;

	@property({type: Number})
	port: number;

	constructor(server: Server) {
		super();

		this.name = server.name;
		this.address = server.address;
		this.port = server.port;
	}


	render() {
		return html`
			<div>
				<h1>${this.name}</h1>
				<span>${this.address}</span>
				<span>${this.port}</span>
			</div>
		`;
	}

}
