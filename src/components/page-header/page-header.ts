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
import { APP_NAME } from '@/models/K4';

@customElement('page-header')
export class PageHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: sticky;
      margin: -2rem;
      margin-bottom: 2rem;
      width: 100vw;
      top: 0;
      padding-bottom: 2rem;
      border-bottom: 1px #ccc solid;
      background: linear-gradient(
        rgba(230, 240, 250, 1),
        rgba(240, 250, 250, 1)
      );
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      margin: 0;
    }

    .inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 2rem;
    }

    .page-header {
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
    return html`<header class="page-header">
      <div class="inner">
        <h1>${APP_NAME}</h1>

        <ss-button @click=${this.showConfirmResetPopUp}>
          ${translate('resetForm')}
        </ss-button>
      </div>

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
