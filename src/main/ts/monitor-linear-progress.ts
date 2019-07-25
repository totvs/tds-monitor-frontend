import { LinearProgress } from '@material/mwc-linear-progress';
import { css, customElement } from 'lit-element';
import { style } from '../css/monitor-linear-progress.css';

@customElement('monitor-linear-progress')
export class MonitoLinearProgress extends LinearProgress {


	static get styles() {
		return css`
			${super.styles}
			${style}
		`;
	}

}


declare global {
	interface HTMLElementTagNameMap {
		'monitor-linear-progress': MonitoLinearProgress;
	}
}


