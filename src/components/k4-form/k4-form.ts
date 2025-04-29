import { css, html, LitElement, PropertyValues } from 'lit';
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

  protected updated(_changedProperties: PropertyValues): void {
    console.log('K4Form updated', _changedProperties);
  }

  render() {
    return html`<div class="k4-form">
      <section>
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
      </section>

      <section>
        <asset-info
          page=${this.page}
          .recordMatrix=${this.recordMatrix}
          .summaryMatrix=${this.summaryMatrix}
          .deferredShare=${this.deferredShare}
        >
        </asset-info>
      </section>
    </div>`;
  }
}
