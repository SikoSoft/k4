import { css, html, LitElement, nothing } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-button';
import '@ss/ui/components/ss-icon';
import './import-modal/import-modal';
import './settings-modal/settings-modal';
import {
  PageHeaderProp,
  pageHeaderProps,
  PageHeaderProps,
} from './page-header.models';
import { translate } from '@/lib/Localization';
import { DownloadBundleEvent, FormResetEvent } from './page-header.events';
import { ifDefined } from 'lit/directives/if-defined.js';
import { classMap } from 'lit/directives/class-map.js';

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

    h1 {
      font-weight:normal;
    }

    .title-ss {
      color: rgba(0,0,0,0.4);
    }

    .title-o {
      color: rgba(0,0,0,0.1);
    }
    .title-sok4 {
      color: rgba(0,0,0,1);
      font-weight:bold;
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
      ss-button {
        display: inline-block;
      }

      ss-button::part(button) {
        padding: 0.5rem 1rem;
        font-size: 1rem;
        font-weight: normal;
        text-transform: none;
      }

      ss-icon: {
      }
    }

    .validation-status {
      position: relative;
    }

    .invalid {
      cursor: pointer;
      user-select: none;
    }

    .validation-errors{
      display: none;
      background-color: #fff;
      position: absolute;
      top: 100%;
      right: 0;
      padding: 0.5rem 1rem;
      width: 300px;
      font-size: 0.8rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

      ul {
        margin: 0;
        padding: 1rem;
      }
    }

    .errors-open .validation-errors {
      display: block;

    }

    .
  `;

  @property({ type: Object })
  [PageHeaderProp.VALIDATION_RESULT]: PageHeaderProps[PageHeaderProp.VALIDATION_RESULT] =
    pageHeaderProps[PageHeaderProp.VALIDATION_RESULT].default;

  @property({ type: Object })
  [PageHeaderProp.SETTINGS]: PageHeaderProps[PageHeaderProp.SETTINGS] =
    pageHeaderProps[PageHeaderProp.SETTINGS].default;

  @state()
  confirmResetPopUpIsOpen = false;

  @state()
  importPopUpIsOpen = false;

  @state()
  settingsPopUpIsOpen = false;

  @state()
  errorListIsOpen = false;

  @state()
  get classes(): Record<string, boolean> {
    return {
      'page-header': true,
      'errors-open': this.errorListIsOpen,
    };
  }

  showImportPopUp() {
    this.importPopUpIsOpen = true;
  }

  hideImportPopUp() {
    this.importPopUpIsOpen = false;
  }

  showConfirmResetPopUp() {
    this.confirmResetPopUpIsOpen = true;
  }

  hideConfirmResetPopUp() {
    this.confirmResetPopUpIsOpen = false;
  }

  showSettingsPopUp() {
    this.settingsPopUpIsOpen = true;
  }

  hideSettingsPopUp() {
    this.settingsPopUpIsOpen = false;
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
    return html`<header class=${classMap(this.classes)}>
      <div class="inner">
        <div class="title-bar">
          <h1>
            <span class="title-ss">SS</span><span class="title-o">O</span
            ><span class="title-k4">K4</span>
          </h1>

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
          <div class="buttons">
            <ss-button @click=${this.showConfirmResetPopUp}>
              ${translate('resetForm')}
            </ss-button>

            <ss-button @click=${this.showImportPopUp}
              >${translate('import')}</ss-button
            >

            <ss-button @click=${this.showSettingsPopUp}
              >${translate('settings')}</ss-button
            >
          </div>

          <div class="validation-status">
            ${this.validationResult.isValid
              ? html`${translate('formIsValid')}
                  <ss-icon
                    name="validCircle"
                    size="24"
                    color="#084"
                  ></ss-icon> `
              : html`<span
                    class="invalid"
                    @click=${() => {
                      this.errorListIsOpen = !this.errorListIsOpen;
                    }}
                    >${translate('formIsInvalid')}
                    <ss-icon
                      name="invalidCircle"
                      size="24"
                      color="#920"
                    ></ss-icon>
                  </span>

                  <div class="validation-errors">
                    <ul>
                      ${this.validationResult.errors.map(
                        error =>
                          html`<li class="validation-error">
                            ${translate(error.message)}
                          </li>`,
                      )}
                    </ul>
                  </div> `}
          </div>
        </div>
      </div>

      <pop-up
        ?open=${this.settingsPopUpIsOpen}
        closeButton
        closeOnOutsideClick
        closeOnEsc
        @pop-up-closed=${this.hideSettingsPopUp}
      >
        <settings-modal .settings=${this.settings}></settings-modal>
      </pop-up>

      <pop-up
        ?open=${this.importPopUpIsOpen}
        closeButton
        closeOnOutsideClick
        closeOnEsc
        @pop-up-closed=${this.hideImportPopUp}
      >
        ${this.importPopUpIsOpen
          ? html`
              <import-modal @import-sru=${this.hideImportPopUp}></import-modal>
            `
          : nothing}
      </pop-up>

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
