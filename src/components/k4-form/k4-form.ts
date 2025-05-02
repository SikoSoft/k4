import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-button';
import '@ss/ui/components/pop-up';

import '@/components/meta-info/meta-info';
import '@/components/person-info/person-info';
import '@/components/asset-info/asset-info';
import '@/components/section-summary/section-summary';
import '@/components/file-preview/file-preview';
import '@/components/deferred-share/deferred-share';
import '@/components/page-header/page-header';

import {
  DeferredShare,
  MetaInfo,
  PersonInfo,
  RecordMatrix,
  SectionSummaryMatrix,
} from '@/models/K4';
import { K4FormProp, K4FormProps, k4FormProps } from './k4-form.models';
import { translate } from '@/lib/Localization';
import { DeletePageEvent } from './k4-form.events';

@customElement('k4-form')
export class K4Form extends LitElement {
  static styles = [
    css`
      fieldset,
      section {
        margin-bottom: 3rem;
        border-radius: 0.5rem;

        legend {
          font-weight: bold;
        }
      }

      .page {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: right;
      }

      .delete-icon {
        cursor: pointer;
        vertical-align: text-top;
      }
    `,
  ];

  @property({ reflect: true })
  [K4FormProp.LANGUAGE]: K4FormProps[K4FormProp.LANGUAGE] =
    k4FormProps[K4FormProp.LANGUAGE].default;

  @property({ type: Object })
  [K4FormProp.FORM_DATA]: K4FormProps[K4FormProp.FORM_DATA] =
    k4FormProps[K4FormProp.FORM_DATA].default;

  @property({ type: Number })
  [K4FormProp.PAGE]: K4FormProps[K4FormProp.PAGE] =
    k4FormProps[K4FormProp.PAGE].default;

  @state()
  deletePopUpIsOpen = false;

  @state()
  get metaInfo(): MetaInfo {
    return this.formData.metaInfo;
  }

  @state()
  get personInfo(): PersonInfo {
    return this.formData.personInfo;
  }

  @state()
  get recordMatrix(): RecordMatrix {
    return this.formData.pages[this.page].recordMatrix;
  }

  @state()
  get summaryMatrix(): SectionSummaryMatrix {
    return this.formData.pages[this.page].summaryMatrix;
  }

  @state()
  get deferredShare(): DeferredShare {
    return this.formData.pages[this.page].deferredShare;
  }

  showDeletePopUp() {
    this.deletePopUpIsOpen = true;
  }
  hideDeletePopUp() {
    this.deletePopUpIsOpen = false;
  }

  deletePage() {
    this.dispatchEvent(new DeletePageEvent({ page: this.page }));
    this.hideDeletePopUp();
  }

  render() {
    return html`<div class="k4-form">
      ${this.page === 0
        ? html`<section>
              <meta-info
                year=${this.metaInfo.year}
                pageNumber=${this.metaInfo.pageNumber}
              ></meta-info>
            </section>

            <section>
              <person-info
                name=${this.personInfo.name}
                personNumber=${this.personInfo.personNumber}
                city=${this.personInfo.city}
                postCode=${this.personInfo.postCode}
              ></person-info>
            </section> `
        : nothing}
      ${this.formData.pages.length > 1
        ? html`<div class="page">
            ${translate('pageX', { page: this.page + 1 })}
            ${this.page > 0
              ? html`<ss-icon
                  size="24"
                  class="delete-icon"
                  name="delete"
                  @click=${this.showDeletePopUp}
                ></ss-icon>`
              : nothing}
          </div>`
        : nothing}

      <section>
        <asset-info
          page=${this.page}
          .recordMatrix=${this.recordMatrix}
          .summaryMatrix=${this.summaryMatrix}
          .deferredShare=${this.deferredShare}
        >
        </asset-info>
      </section>

      <pop-up
        ?open=${this.deletePopUpIsOpen}
        closeButton
        closeOnOutsideClick
        closeOnEsc
        @pop-up-closed=${this.hideDeletePopUp}
      >
        ${translate('confirmDeletePage')}

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
          <ss-button @click=${this.deletePage}>${translate('yes')}</ss-button>

          <ss-button @click=${this.hideDeletePopUp}>
            ${translate('no')}
          </ss-button>
        </div>
      </pop-up>
    </div>`;
  }
}
