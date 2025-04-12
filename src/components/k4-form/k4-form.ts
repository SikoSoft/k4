import { html, LitElement, nothing } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-loader';

@customElement('k4-form')
export class K4Form extends LitElement {
  render() {
    return html`<ss-loader></ss-loader>`;
  }
}
