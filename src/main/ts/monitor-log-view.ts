import { CSSResult, customElement, html, LitElement, TemplateResult } from 'lit-element';
import { style } from '../css/monitor-log-view.css';
import { MessageType } from './monitor-app';

@customElement('monitor-log-view')
export class MonitorLogView extends LitElement {

	initialY: number = null;
	initialHeight: number = null;

	constructor() {
		super();
	}

	static get styles(): CSSResult {
		return style;
	}

	render(): TemplateResult {
		return html`
			<mark @mousedown="${this.onResizeStart}"></mark>
			<header>
				<div></div>
				<mwc-icon @click="${this.onCloseClicked}">close</mwc-icon>
			</header>
			<slot></slot>
		`;
	}

	onCloseClicked(event: MouseEvent) {
		const serverView = document.querySelector('monitor-server-view');

		serverView.showlog = false;
	}

	onResizeStart(event: MouseEvent) {
		const moveListener = (event: MouseEvent) => this.onResizeMove(event);
		const endListener = (event: MouseEvent) => {
			document.removeEventListener('mousemove', moveListener);
			document.removeEventListener('mouseup', endListener);
			document.removeEventListener('mouseout', endListener);

			return this.onResizeEnd(event);
		};

		document.addEventListener('mousemove', moveListener);
		document.addEventListener('mouseup', endListener);
		document.addEventListener('mouseout', endListener);

		this.initialY = event.clientY;
		this.initialHeight = this.clientHeight;

		document.body.classList.add('resizing-ns');

		return false;
	}

	onResizeMove(event: MouseEvent) {
		let height = this.initialHeight + (this.initialY - event.clientY);

		this.style.flexBasis = `${height}px`;
	}

	onResizeEnd(event: MouseEvent) {
		document.body.classList.remove('resizing-ns');

		return false;
	}


	add(message: string, type: MessageType) {
		const slot = this.renderRoot.querySelector('slot'),
			span = document.createElement('span');

		switch (type) {
			case MessageType.ERROR:
				span.innerHTML = "[ERROR] ";
				break;
			case MessageType.WARNING:
				span.innerHTML = "[WARN ] ";
				break;
			case MessageType.INFO:
				span.innerHTML = "[INFO ] ";
				break;
			case MessageType.LOG:
				span.innerHTML = "[LOG  ] ";
				break;
			default:
				span.innerHTML = "[     ] ";
				break;
		}

		span.innerHTML += message;

		this.append(span);

		if (this.childElementCount > 200) {
			this.removeChild(this.children[0]);
		}

		requestAnimationFrame(() => slot.scrollTop = slot.scrollHeight);
	}
}

declare global {
	interface HTMLElementTagNameMap {
		'monitor-log-view': MonitorLogView;
	}
}
