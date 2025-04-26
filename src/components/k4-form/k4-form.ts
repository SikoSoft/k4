import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

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
import { translate } from '@/lib/Localization';
import { DeferredShareChangedEvent } from '@/components/deferred-share/deferred-share.events';
import { Validation } from '@/lib/Validation';
import { addNotification } from '@/lib/Notification';
import { NotificationType } from '@ss/ui/components/notification-provider.models';
import { assetRecordProps } from '@/components/asset-record/asset-record.models';
import { ImportSruEvent } from '@/components/page-header/import-modal/import-modal.events';
import { K4 } from '@/lib/K4';

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

      records.forEach((record, row) => {
        if (this.sectionRowIsValid(sectionKey, row)) {
          Object.values(AssetRecordField).forEach(field => {
            const fieldEntry = assetFieldMap.find(
              (entry: AssetFieldConfig) =>
                entry.location[0] === sectionKey &&
                entry.location[1] === row &&
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
    this.recordMatrix = K4.prepareRecordMatrix();
    this.loadFromStorage();
    this.validate(false);
  }

  updateMetaInfo(event: MetaInfoChangedEvent) {
    this.metaInfo = event.detail;
    this.handleUpdate();
  }

  updatePersonInfo(event: PersonInfoChangedEvent) {
    this.personInfo = event.detail;
    this.handleUpdate();
  }

  updateSectionSummary(event: SectionSummaryChangedEvent) {
    const { section, ...summary } = event.detail;
    this.summaryMatrix = {
      ...this.summaryMatrix,
      [section]: {
        ...this.summaryMatrix[section],
        ...summary,
      },
    };
    this.handleUpdate();
  }

  updateAssetRecord(event: AssetRecordChangedEvent) {
    const { section, row, ...newRecord } = event.detail;
    this.recordMatrix = {
      ...this.recordMatrix,
      [section]: [
        ...this.recordMatrix[section].map((record, index) =>
          index === row ? newRecord : record,
        ),
      ],
    };

    this.requestUpdate();
    this.handleUpdate();
  }

  updateDeferredShare(event: DeferredShareChangedEvent) {
    this.deferredShare = event.detail;
    this.handleUpdate();
  }

  handleUpdate() {
    this.saveToStorage();
    this.validate(false);
  }

  sectionRowIsValid(section: SectionType, row: number): boolean {
    const record = this.recordMatrix[section][row];
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

  validate(showNotification = true): ValidationResult {
    this.validationResult = Validation.validate(this.data);
    if (showNotification) {
      if (this.validationResult.isValid) {
        addNotification(translate('formIsValid'), NotificationType.SUCCESS);
      } else {
        addNotification(translate('formIsInvalid'), NotificationType.ERROR);
      }
    }
    return this.validationResult;
  }

  async download(): Promise<void> {
    try {
      const zip = new JSZip();

      zip.file(FileName.DATA, this.blanketter);
      zip.file(FileName.MANIFEST, this.info);

      const content = await zip.generateAsync({
        type: 'blob',
        compression: 'DEFLATE',
        compressionOptions: {
          level: 9,
        },
      });

      saveAs(content, `${this.personInfo.name}-K4-${this.metaInfo.year}.zip`);
      addNotification(translate('fileDownloaded'), NotificationType.SUCCESS);
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
    this.recordMatrix = K4.prepareRecordMatrix();
    this.summaryMatrix = { ...DEFAULT_SECTION_SUMMARY };
    this.deferredShare = { ...DEFAULT_DEFERRED_SHARE };
    localStorage.removeItem(STORAGE_KEY);
    addNotification(translate('formHasBeenReset'), NotificationType.INFO);
    this.validate(false);
    this.requestUpdate();
  }

  import(manifest: string, data: string) {
    console.log('import', manifest, data);
    const importDataLines = data.split('\n');
    for (const line of importDataLines) {
      if (line.match(/^#UPPGIFT /)) {
        const fieldId = parseInt(line.replace(/^#UPPGIFT ([0-9]{4}).*/, '$1'));
        const fieldValue = line.replace(/^#UPPGIFT [0-9]{4} (.*)/, '$1');

        const fieldEntry = assetFieldMap.find(
          (entry: AssetFieldConfig) => entry.id === fieldId,
        );
        if (fieldEntry) {
          const sectionKey = fieldEntry.location[0];
          const index = fieldEntry.location[1];
          const field = fieldEntry.location[2];

          const value =
            assetRecordProps[field].control === 'text'
              ? fieldValue
              : isNaN(parseInt(fieldValue || '0'))
                ? 0
                : parseInt(fieldValue || '0');

          this.recordMatrix = {
            ...this.recordMatrix,
            [sectionKey]: [
              ...this.recordMatrix[sectionKey].map((record, i) =>
                i === index ? { ...record, [field]: value } : record,
              ),
            ],
          };
        }
      }
    }
    this.requestUpdate();
    this.handleUpdate();
    addNotification(translate('dataImported'), NotificationType.INFO);
  }

  render() {
    return html`<div class="k4">
      <page-header
        @form-reset=${this.reset}
        @download-bundle=${this.download}
        @import-sru=${(e: ImportSruEvent): void => {
          this.import(e.detail.manifest, e.detail.data);
        }}
        .validationResult=${this.validationResult}
      ></page-header>

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

      <section>
        <asset-info
          @deferred-share-changed=${this.updateDeferredShare}
          @section-summary-changed=${this.updateSectionSummary}
          @asset-record-changed=${this.updateAssetRecord}
          .recordMatrix=${this.recordMatrix}
          .summaryMatrix=${this.summaryMatrix}
          .deferredShare=${this.deferredShare}
        >
        </asset-info>
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
