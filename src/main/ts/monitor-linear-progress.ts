import { LinearProgress } from '@material/mwc-linear-progress';
import { customElement, html } from 'lit-element';

@customElement('monitor-linear-progress')
export class MonitoLinearProgress extends LinearProgress {

	render() {
		return html`
			<style>
				span.mdc-linear-progress__bar-inner {
					background-color: #EA9B3E;
				}

				.mdc-linear-progress--indeterminate div.mdc-linear-progress__secondary-bar {
					visibility: inherit;
				}
			</style>
			${super.render()}
		`;
	}
}


declare global {
	interface HTMLElementTagNameMap {
		'monitor-linear-progress': MonitoLinearProgress;
	}
}


