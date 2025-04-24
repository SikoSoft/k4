import { css, html, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-button';
import '@ss/ui/components/ss-icon';
import {
  PageHeaderProp,
  pageHeaderProps,
  PageHeaderProps,
} from './page-header.models';
import { translate } from '@/lib/Localization';
import { DownloadBundleEvent, FormResetEvent } from './page-header.events';
import { APP_NAME } from '@/models/K4';
import { ifDefined } from 'lit/directives/if-defined.js';

@customElement('page-header')
export class PageHeader extends LitElement {
  static styles = css`
    :host {
      display: block;
      position: sticky;
      margin: -2rem;
      margin-bottom: 2rem;
      width: 100vw;
      height: 10rem;
      top: 0;
      border-bottom: 1px #ccc solid;
      background: linear-gradient(
        rgba(230, 240, 250, 1),
        rgba(240, 250, 250, 1)
      );
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    header {
      height: 100%;
    }

    h1 {
      margin: 0;
    }

    .inner {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      position: relative;
      padding: 0rem 2rem;
      height: 100%;
    }

    .title-bar,
    .tool-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    ss-button::part(button) {
      padding: 1rem 2rem;
      display: inline-block;
      font-weight: bold;
      border-width: 1px;

      text-transform: uppercase;
    }

    ss-button:not([disabled])::part(button) {
      cursor: pointer;
    }

    .download-button::part(button) {
      font-size: 1.125rem;
    }

    .tool-bar {
      ss-button::part(button) {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        font-weight: normal;
        text-transform: none;
      }

      ss-icon: {
      }
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

  downloadBundle() {
    this.dispatchEvent(new DownloadBundleEvent({}));
  }

  render() {
    return html`<header class="page-header">
      <div class="inner">
        <div class="title-bar">
          <h1>${APP_NAME}</h1>

          <ss-button
            class="download-button"
            @click=${this.downloadBundle}
            ?disabled=${!this.validationResult.isValid}
            ?positive=${this.validationResult.isValid}
            title=${ifDefined(
              !this.validationResult.isValid
                ? translate('cannotDownloadWhenInvalid')
                : undefined,
            )}
            >${translate('download')}</ss-button
          >
        </div>
        <div class="tool-bar">
          <ss-button @click=${this.showConfirmResetPopUp}>
            ${translate('resetForm')}
          </ss-button>
          <div class="validation-status">
            ${this.validationResult.isValid
              ? html`${translate('formIsValid')}
                  <ss-icon
                    name="validCircle"
                    size="24"
                    color="#084"
                  ></ss-icon> `
              : html`${translate('formIsInvalid')}
                  <ss-icon
                    name="invalidCircle"
                    size="24"
                    color="#920"
                  ></ss-icon> `}
          </div>
        </div>
      </div>

      <pop-up
        ?open=${this.confirmResetPopUpIsOpen}
        closeButton
        closeOnOutsideClick
        closeOnEsc
        @pop-up-closed=${this.hideConfirmResetPopUp}
      >
        ${translate('confirmResetForm')}

        <style>
          .pop-up-buttons {
            display: flex;
            justify-content: center;
            margin-top: 2rem;
            padding: 0;
            gap: 1rem;
          }

          ss-button {
          }

          ss-button::part(button) {
            padding: 0.5rem 2rem;
            display: inline-block;
          }
        </style>

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
