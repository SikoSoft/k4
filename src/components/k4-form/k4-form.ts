import { css, html, LitElement, nothing } from 'lit';
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

import { AssetRecordChangedEvent } from '@/components/asset-record/asset-record.events';
import { PersonInfoChangedEvent } from '@/components/person-info/person-info.events';
import { MetaInfoChangedEvent } from '@/components/meta-info/meta-info.events';
import {
  APP_NAME,
  AssetFieldConfig,
  assetFieldMap,
  AssetRecordField,
  DEFAULT_DEFERRED_SHARE,
  DEFAULT_META_INFO,
  DEFAULT_PERSON_INFO,
  DEFAULT_SECTION_SUMMARY,
  DeferredShare,
  FileName,
  K4Data,
  MetaInfo,
  PersonInfo,
  RecordMatrix,
  SectionSummaryField,
  SectionSummaryMatrix,
  SectionType,
  STORAGE_KEY,
  SummaryFieldConfig,
  summaryFieldMap,
  ValidationResult,
} from '@/models/K4';
import { SectionSummaryChangedEvent } from '@/components/section-summary/section-summary.events';
import { localization, translate } from '@/lib/Localization';
import { DeferredShareChangedEvent } from '@/components/deferred-share/deferred-share.events';
import { Validation } from '@/lib/Validation';
import { addNotification } from '@/lib/Notification';
import { NotificationType } from '@ss/ui/components/notification-provider.models';
import { ImportSruEvent } from '@/components/page-header/import-modal/import-modal.events';
import { K4 } from '@/lib/K4';
import { DEFAULT_SETTINGS, Settings } from '@/models/Settings';
import { SettingsChangedEvent } from '@/components/page-header/settings-modal/settings-modal.events';
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

  @state()
  metaInfo: MetaInfo = { ...DEFAULT_META_INFO };

  @state()
  personInfo: PersonInfo = { ...DEFAULT_PERSON_INFO };

  @state()
  get recordMatrix(): RecordMatrix {
    return this.formData.recordMatrix;
  }

  @state()
  get summaryMatrix(): SectionSummaryMatrix {
    return this.formData.summaryMatrix;
  }

  @state()
  get deferredShare(): DeferredShare {
    return this.formData.deferredShare;
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
          .recordMatrix=${this.recordMatrix}
          .summaryMatrix=${this.summaryMatrix}
          .deferredShare=${this.deferredShare}
        >
        </asset-info>
      </section>
    </div>`;
  }
}
