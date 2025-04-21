import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-button';
import {
  PageHeaderProp,
  pageHeaderProps,
  PageHeaderProps,
} from './page-header.models';
import { translate } from '@/lib/Localization';
import { FormResetEvent } from './page-header.events';

@customElement('page-header')
export class PageHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .page-header {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
  `;

  @property({ type: Object })
  [PageHeaderProp.VALIDATION_RESULT]: PageHeaderProps[PageHeaderProp.VALIDATION_RESULT] =
    pageHeaderProps[PageHeaderProp.VALIDATION_RESULT].default;

  @state()
  confirmResetPopUpIsOpen = false;

  showConfirmResetPopUp() {
    this.confirmResetPopUpIsOpen = true;
  }

  hideConfirmResetPopUp() {
    this.confirmResetPopUpIsOpen = false;
  }

  resetForm() {
    this.sendResetEvent();
    this.hideConfirmResetPopUp();
  }

  sendResetEvent() {
    this.dispatchEvent(new FormResetEvent({}));
  }

  render() {
    return html`<header>
      <h1></h1>

      <ss-button @click=${this.showConfirmResetPopUp}>
        ${translate('resetForm')}
      </ss-button>

      <pop-up
        ?open=${this.confirmResetPopUpIsOpen}
        closeButton
        closeOnOutsideClick
        closeOnEsc
        @pop-up-closed=${this.hideConfirmResetPopUp}
      >
        ${translate('confirmResetForm')}

        <div class="pop-up-buttons">
          <ss-button @click=${this.resetForm}> ${translate('yes')} </ss-button>

          <ss-button @click=${this.hideConfirmResetPopUp}>
            ${translate('no')}
          </ss-button>
        </div>
      </pop-up>
    </header> `;
  }
}
