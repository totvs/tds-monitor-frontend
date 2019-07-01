import { LitElement, html, css, customElement, CSSResult } from 'lit-element';

@customElement('monitor-body')
export class MonitorBody extends LitElement {

    static get styles(): CSSResult {
        return css`
            :host {
                flex-grow: 1;
                display: flex;
            }
            `;
    }

    render() {
        return html`
          <slot></slot>
        `;
    }

}

