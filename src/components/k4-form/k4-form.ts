import { css, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import '@ss/ui/components/ss-button';
import '@ss/ui/components/pop-up';

import '@/components/meta-info/meta-info';
import '@/components/person-info/person-info';
import '@/components/asset-record/asset-record';
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
  AssetRecord,
  AssetRecordField,
  DEFAULT_DEFERRED_SHARE,
  DEFAULT_META_INFO,
  DEFAULT_PERSON_INFO,
  DEFAULT_SECTION_SUMMARY,
  DeferredShare,
  K4Data,
  MetaInfo,
  PersonInfo,
  RecordMatrix,
  sectionConfigMap,
  SectionSummary,
  SectionSummaryField,
  SectionSummaryMatrix,
  SectionType,
  STORAGE_KEY,
  SummaryFieldConfig,
  summaryFieldMap,
  ValidationResult,
} from '@/models/K4';
import { SectionSummaryChangedEvent } from '../section-summary/section-summary.events';
import { translate } from '@/lib/Localization';
import { DeferredShareChangedEvent } from '../deferred-share/deferred-share.events';
import { Validation } from '@/lib/Validation';
import { addNotification } from '@/lib/Notification';
import { NotificationType } from '@ss/ui/components/notification-provider.models';

@customElement('k4-form')
export class K4Form extends LitElement {
  static styles = [
    css`
      fieldset,
      section {
        margin-bottom: 1rem;
        border-radius: 0.5rem;

        legend {
          font-weight: bold;
        }

        asset-record {
          margin-bottom: 1rem;
        }
      }
    `,
  ];

  @state()
  private recordMatrix: RecordMatrix = {
    [SectionType.A]: [],
    [SectionType.B]: [],
    [SectionType.C]: [],
    [SectionType.D]: [],
  };

  @state()
  private summaryMatrix: SectionSummaryMatrix = { ...DEFAULT_SECTION_SUMMARY };

  @state()
  deferredShare: DeferredShare = { ...DEFAULT_DEFERRED_SHARE };

  @state()
  metaInfo: MetaInfo = { ...DEFAULT_META_INFO };

  @state()
  personInfo: PersonInfo = { ...DEFAULT_PERSON_INFO };

  @state()
  validationResult: ValidationResult = {
    isValid: false,
    errors: [],
  };

  get data(): K4Data {
    return {
      metaInfo: this.metaInfo,
      personInfo: this.personInfo,
      recordMatrix: this.recordMatrix,
      summaryMatrix: this.summaryMatrix,
      deferredShare: this.deferredShare,
    };
  }

  get createdDate(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hour = date.getHours().toString().padStart(2, '0');
    const minute = date.getMinutes().toString().padStart(2, '0');
    const second = date.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day} ${hour}${minute}${second}`;
  }

  @state()
  get info(): string {
    return `#DATABESKRIVNING_START
#PRODUKT SRU
#SKAPAD ${this.createdDate}
#PROGRAM ${APP_NAME}
#FILNAMN BLANKETTER.SRU
#DATABESKRIVNING_SLUT
#MEDIELEV_START
#ORGNR ${this.personInfo.personNumber}
#NAMN ${this.personInfo.name}
#POSTNR ${this.personInfo.postCode}
#POSTORT ${this.personInfo.city}
#MEDIELEV_SLUT`;
  }

  @state()
  get blanketter(): string {
    let data = `#BLANKETT K4-2024P4
#IDENTITET ${this.personInfo.personNumber} ${this.createdDate}
#NAMN ${this.personInfo.name}
#SYSTEMINFO klarmarkerad u. a.
`;
    Object.keys(this.recordMatrix).forEach(key => {
      const sectionKey = key as SectionType;
      const records = this.recordMatrix[sectionKey];

      records.forEach((record, index) => {
        if (this.sectionRowIsValid(sectionKey, index)) {
          Object.values(AssetRecordField).forEach(field => {
            const fieldEntry = assetFieldMap.find(
              (entry: AssetFieldConfig) =>
                entry.location[0] === sectionKey &&
                entry.location[1] === index &&
                entry.location[2] === field,
            );

            if (fieldEntry) {
              const fieldValue = record[field];
              if (fieldValue !== 0 || field === AssetRecordField.TOTAL) {
                data += `#UPPGIFT ${fieldEntry.id} ${fieldValue}\n`;
              }
            }
          });
        }
      });

      if (this.sectionSummaryIsValid(sectionKey)) {
        Object.values(SectionSummaryField).forEach(field => {
          const fieldEntry = summaryFieldMap.find(
            (entry: SummaryFieldConfig) =>
              entry.location[0] === sectionKey && entry.location[1] === field,
          );

          if (fieldEntry) {
            const fieldValue = this.summaryMatrix[sectionKey][field];
            if (
              fieldValue !== 0 ||
              [
                SectionSummaryField.TOTAL_SELL_PRICE,
                SectionSummaryField.TOTAL_BUY_PRICE,
              ].includes(field)
            ) {
              data += `#UPPGIFT ${fieldEntry.id} ${fieldValue}\n`;
            }
          }
        });
      }
    });

    data += `#BLANKETTSLUT
#FIL_SLUT`;

    return data;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.recordMatrix = this.prepareRecordMatrix();
    this.loadFromStorage();
    this.validate();
  }

  prepareRecordMatrix(): RecordMatrix {
    const recordMatrix = Object.keys(sectionConfigMap).reduce((acc, key) => {
      const sectionKey = key as SectionType;
      const sectionConfig = sectionConfigMap[sectionKey];
      const records = [...new Array(sectionConfig.numRecords)].map(() => {
        return {
          total: 0,
          asset: '',
          buyPrice: 0,
          sellPrice: 0,
          gain: 0,
          loss: 0,
        };
      });
      acc[sectionKey] = records;
      return acc;
    }, {} as RecordMatrix);
    return recordMatrix;
  }

  updateMetaInfo(event: MetaInfoChangedEvent) {
    this.metaInfo = event.detail;
    this.saveToStorage();
  }

  updatePersonInfo(event: PersonInfoChangedEvent) {
    this.personInfo = event.detail;
    this.saveToStorage();
  }

  updateSectionSummary(section: SectionType, summary: SectionSummary) {
    this.summaryMatrix[section] = summary;
    this.requestUpdate();
    this.saveToStorage();
  }

  updateAssetRecord(section: SectionType, index: number, record: AssetRecord) {
    this.recordMatrix[section][index] = record;
    this.requestUpdate();
    this.saveToStorage();
  }

  updateDeferredShare(event: DeferredShareChangedEvent) {
    this.deferredShare = event.detail;
    this.saveToStorage();
  }

  sectionRowIsValid(section: SectionType, index: number): boolean {
    const record = this.recordMatrix[section][index];
    return (
      record.asset !== '' &&
      record.buyPrice !== 0 &&
      record.sellPrice !== 0 &&
      (record.gain > 0 || record.loss > 0)
    );
  }

  sectionSummaryIsValid(section: SectionType): boolean {
    const summary = this.summaryMatrix[section];
    return (
      summary.totalSellPrice !== 0 &&
      summary.totalBuyPrice !== 0 &&
      (summary.totalGain > 0 || summary.totalLoss > 0)
    );
  }

  validate(): ValidationResult {
    this.validationResult = Validation.validate(this.data);
    if (this.validationResult.isValid) {
      addNotification(translate('formIsValid'), NotificationType.SUCCESS);
    } else {
      addNotification(translate('formIsInvalid'), NotificationType.ERROR);
    }
    return this.validationResult;
  }

  async download(): Promise<void> {
    try {
      const zip = new JSZip();

      zip.file('BLANKETTER.SRU', this.blanketter);
      zip.file('INFO.SRU', this.info);

      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });

      saveAs(content, `${this.personInfo.name}-K4-${this.metaInfo.year}.zip`);
    } catch (error) {
      console.error('Error creating ZIP file:', error);
    }
  }

  saveToStorage() {
    const data: K4Data = {
      metaInfo: this.metaInfo,
      personInfo: this.personInfo,
      recordMatrix: this.recordMatrix,
      summaryMatrix: this.summaryMatrix,
      deferredShare: this.deferredShare,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data) as K4Data;
      this.metaInfo = parsedData.metaInfo;
      this.personInfo = parsedData.personInfo;
      this.recordMatrix = parsedData.recordMatrix;
      this.summaryMatrix = parsedData.summaryMatrix;
      this.deferredShare = parsedData.deferredShare;
    }
    this.requestUpdate();
  }

  reset() {
    this.metaInfo = { ...DEFAULT_META_INFO };
    this.personInfo = { ...DEFAULT_PERSON_INFO };
    this.recordMatrix = this.prepareRecordMatrix();
    this.summaryMatrix = { ...DEFAULT_SECTION_SUMMARY };
    this.deferredShare = { ...DEFAULT_DEFERRED_SHARE };
    localStorage.removeItem(STORAGE_KEY);
    addNotification(translate('formHasBeenReset'), NotificationType.INFO);
    this.requestUpdate();
  }

  render() {
    return html`<div class="k4">
      <page-header @form-reset=${this.reset}></page-header>

      <section>
        <meta-info
          @meta-info-changed=${this.updateMetaInfo}
          year=${this.metaInfo.year}
          pageNumber=${this.metaInfo.pageNumber}
        ></meta-info>
      </section>

      <section>
        <person-info
          @person-info-changed=${this.updatePersonInfo}
          name=${this.personInfo.name}
          personNumber=${this.personInfo.personNumber}
          city=${this.personInfo.city}
          postCode=${this.personInfo.postCode}
        ></person-info>
      </section>

      ${repeat(
        Object.keys(sectionConfigMap),
        sectionKey => sectionKey,
        key => {
          const sectionKey = key as SectionType;
          const sectionConfig = sectionConfigMap[sectionKey];
          return html`<fieldset>
            <legend>
              ${sectionConfig.type}.
              ${translate(`sectionHeading.${sectionConfig.type}`)}
            </legend>

            ${sectionConfig.type === SectionType.B
              ? html`
                  <deferred-share
                    @deferred-share-changed=${this.updateDeferredShare}
                    deferredShareDesignation=${this.deferredShare
                      .deferredShareDesignation}
                    deferredShareAmount=${this.deferredShare
                      .deferredShareAmount}
                  ></deferred-share>
                `
              : repeat(
                  [...new Array(sectionConfig.numRecords)].map(
                    (_, index) => index,
                  ),
                  index => index,
                  index =>
                    html` <asset-record
                      @asset-record-changed=${(
                        event: AssetRecordChangedEvent,
                      ) => {
                        this.updateAssetRecord(
                          sectionConfig.type,
                          index,
                          event.detail,
                        );
                      }}
                      total=${this.recordMatrix[sectionKey][index].total}
                      asset=${this.recordMatrix[sectionKey][index].asset}
                      sellPrice=${this.recordMatrix[sectionKey][index]
                        .sellPrice}
                      buyPrice=${this.recordMatrix[sectionKey][index].buyPrice}
                      gain=${this.recordMatrix[sectionKey][index].gain}
                      loss=${this.recordMatrix[sectionKey][index].loss}
                    ></asset-record>`,
                )}
            ${sectionConfig.numRecords > 0
              ? html`
                  <section-summary
                    @section-summary-changed=${(
                      event: SectionSummaryChangedEvent,
                    ) => {
                      this.updateSectionSummary(
                        sectionConfig.type,
                        event.detail,
                      );
                    }}
                    totalSellPrice=${this.summaryMatrix[sectionKey]
                      .totalSellPrice}
                    totalBuyPrice=${this.summaryMatrix[sectionKey]
                      .totalBuyPrice}
                    totalGain=${this.summaryMatrix[sectionKey].totalGain}
                    totalLoss=${this.summaryMatrix[sectionKey].totalLoss}
                  ></section-summary>
                `
              : nothing}
          </fieldset> `;
        },
      )}

      <ss-button @click=${this.validate}>${translate('validate')}</ss-button>

      <section class="validation">
        ${this.validationResult.isValid
          ? html`<p>${translate('formIsValid')}</p>`
          : html`<p>${translate('formIsInvalid')}</p>
              <ul>
                ${repeat(
                  this.validationResult.errors,
                  error => error.field,
                  error => html`<li>${error.message}</li>`,
                )}
              </ul>`}
      </section>

      <section class="download">
        <ss-button
          @click=${this.download}
          ?disabled=${!this.validationResult.isValid}
          >${translate('download')}</ss-button
        >
      </section>

      <section>
        <file-preview>
          <div slot="info">${this.info}</div>
          <div slot="blanketter">${this.blanketter}</div>
        </file-preview>
      </section>
    </div>`;
  }
}
