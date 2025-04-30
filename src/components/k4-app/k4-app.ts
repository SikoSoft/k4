import { css, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import '@/components/k4-form/k4-form';
import { K4 } from '@/lib/K4';
import {
  APP_NAME,
  AssetFieldConfig,
  assetFieldMap,
  AssetRecordField,
  DEFAULT_META_INFO,
  DEFAULT_PERSON_INFO,
  FileName,
  K4Data,
  K4Page,
  MetaInfo,
  PersonInfo,
  SectionSummaryField,
  SectionType,
  STORAGE_KEY,
  SummaryFieldConfig,
  summaryFieldMap,
  ValidationResult,
} from '@/models/K4';
import { localization, translate } from '@/lib/Localization';
import { ImportSruEvent } from '../page-header/import-modal/import-modal.events';
import { Validation } from '@/lib/Validation';
import { addNotification } from '@/lib/Notification';
import { NotificationType } from '@ss/ui/components/notification-provider.models';
import { DEFAULT_SETTINGS, Settings } from '@/models/Settings';
import { MetaInfoChangedEvent } from '@/components/meta-info/meta-info.events';
import { AssetRecordChangedEvent } from '@/components/asset-record/asset-record.events';
import { DeferredShareChangedEvent } from '@/components/deferred-share/deferred-share.events';
import { SettingsChangedEvent } from '@/components/page-header/settings-modal/settings-modal.events';
import { PersonInfoChangedEvent } from '@/components/person-info/person-info.events';
import { SectionSummaryChangedEvent } from '@/components/section-summary/section-summary.events';
import { produce } from 'immer';
import { DeletePageEvent } from '../k4-form/k4-form.events';

@customElement('k4-app')
export class K4App extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .meta-info {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      justify-content: end;

      .year {
        flex-grow: 1;
      }

      .page-number {
        flex-grow: 1;
      }
    }

    .add-page {
      ss-button::part(button) {
        background-color: #fff;
        cursor: pointer;
        margin-bottom: 3rem;
      }
    }
  `;

  @state()
  settings: Settings = { ...DEFAULT_SETTINGS };

  @state()
  pages: K4Page[] = [K4.getDefaultK4PageData()];

  @state()
  metaInfo: MetaInfo = { ...DEFAULT_META_INFO };

  @state()
  personInfo: PersonInfo = { ...DEFAULT_PERSON_INFO };

  @state()
  validationResult: ValidationResult = {
    isValid: false,
    errors: [],
  };

  connectedCallback(): void {
    super.connectedCallback();

    this.loadFromStorage();
    this.validate(false);
  }

  @state()
  get data(): K4Data {
    return {
      metaInfo: this.metaInfo,
      personInfo: this.personInfo,
      pages: this.pages,
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
    let data = '';
    for (let page = 0; page < this.pages.length; page++) {
      data += `#BLANKETT K4-2024P4
#IDENTITET ${this.personInfo.personNumber} ${this.createdDate}
#NAMN ${this.personInfo.name}
#SYSTEMINFO klarmarkerad u. a.\n`;
      Object.keys(this.pages[page].recordMatrix).forEach(key => {
        const sectionKey = key as SectionType;
        const records = this.pages[page].recordMatrix[sectionKey];

        records.forEach((record, row) => {
          if (this.sectionRowIsValid(page, sectionKey, row)) {
            Object.values(AssetRecordField).forEach(field => {
              const fieldEntry = assetFieldMap.find(
                (entry: AssetFieldConfig) =>
                  entry.location[0] === sectionKey &&
                  entry.location[1] === row &&
                  entry.location[2] === field,
              );

              if (fieldEntry) {
                const fieldValue = record[field];
                if (
                  fieldValue !== 0 ||
                  field === AssetRecordField.TOTAL ||
                  field === AssetRecordField.BUY_PRICE
                ) {
                  data += `#UPPGIFT ${fieldEntry.id} ${fieldValue}\n`;
                }
              }
            });
          }
        });

        if (this.sectionSummaryIsValid(page, sectionKey)) {
          Object.values(SectionSummaryField).forEach(field => {
            const fieldEntry = summaryFieldMap.find(
              (entry: SummaryFieldConfig) =>
                entry.location[0] === sectionKey && entry.location[1] === field,
            );

            if (fieldEntry) {
              const fieldValue =
                this.pages[page].summaryMatrix[sectionKey][field];
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

      data += `#BLANKETTSLUT\n`;
    }
    data += `#FIL_SLUT`;

    return data;
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
    const { section, page, ...summary } = event.detail;
    const pages = produce(this.pages, draft => {
      draft[page].summaryMatrix[section] = summary;
    });
    this.pages = pages;
    this.handleUpdate();
  }

  updateAssetRecord(event: AssetRecordChangedEvent) {
    const { section, row, page, ...newRecord } = event.detail;
    const pages: K4Page[] = produce(this.pages, draft => {
      draft[page].recordMatrix[section][row] = newRecord;
    });
    this.pages = pages;
    this.handleUpdate();
  }

  updateDeferredShare(event: DeferredShareChangedEvent) {
    const { page, ...newDeferredShare } = event.detail;
    const pages: K4Page[] = produce(this.pages, draft => {
      draft[page].deferredShare = newDeferredShare;
    });
    this.pages = pages;
    this.handleUpdate();
  }

  updateSettings(event: SettingsChangedEvent) {
    this.settings = produce(event.detail, draft => draft);
    console.log('Settings updated:', this.settings);
    localization.setLanguage(this.settings.language);
    this.handleUpdate();
  }

  handleDeletePage(event: DeletePageEvent) {
    const page = event.detail.page;

    this.pages = produce(this.pages, draft => {
      draft = draft.filter((_, index) => index !== page);
    });

    this.handleUpdate();
  }

  sectionRowIsValid(page: number, section: SectionType, row: number): boolean {
    const record = this.pages[page].recordMatrix[section][row];
    return (
      record.asset !== '' &&
      record.sellPrice !== 0 &&
      (record.gain > 0 || record.loss > 0)
    );
  }

  sectionSummaryIsValid(page: number, section: SectionType): boolean {
    const summary = this.pages[page].summaryMatrix[section];
    return (
      summary.totalSellPrice !== 0 &&
      summary.totalBuyPrice !== 0 &&
      (summary.totalGain > 0 || summary.totalLoss > 0)
    );
  }

  handleUpdate() {
    this.saveToStorage();
    this.validate(false);
  }

  addPage() {
    this.pages = [...this.pages, K4.getDefaultK4PageData()];
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

  saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
  }

  loadFromStorage() {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsedData = JSON.parse(data) as K4Data;
      this.metaInfo = parsedData.metaInfo;
      this.personInfo = parsedData.personInfo;
      this.pages = parsedData.pages;
    }
    this.requestUpdate();
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

  reset(activeReset = true) {
    this.metaInfo = { ...DEFAULT_META_INFO };
    this.personInfo = { ...DEFAULT_PERSON_INFO };
    this.pages = [K4.getDefaultK4PageData()];
    localStorage.removeItem(STORAGE_KEY);
    if (activeReset) {
      addNotification(translate('formHasBeenReset'), NotificationType.INFO);
    }
    this.validate(false);
    this.requestUpdate();
  }

  import(manifest: string, data: string) {
    this.reset(false);
    const k4Data = K4.import(manifest, data);
    this.metaInfo = k4Data.metaInfo;
    this.personInfo = k4Data.personInfo;
    this.pages = k4Data.pages;
    this.requestUpdate();
    this.handleUpdate();
    addNotification(translate('dataImported'), NotificationType.INFO);
  }

  render() {
    return html`<div class="k4-app">
      <page-header
        @form-reset=${this.reset}
        @download-bundle=${this.download}
        @import-sru=${(e: ImportSruEvent): void => {
          this.import(e.detail.manifest, e.detail.data);
        }}
        @settings-changed=${this.updateSettings}
        .validationResult=${this.validationResult}
        .settings=${this.settings}
      ></page-header>

      ${[...new Array(this.pages.length)].map((_, index) => {
        return html` <k4-form
          page=${index}
          .formData=${this.data}
          @delete-page=${this.handleDeletePage}
          @meta-info-changed=${this.updateMetaInfo}
          @person-info-changed=${this.updatePersonInfo}
          @deferred-share-changed=${this.updateDeferredShare}
          @section-summary-changed=${this.updateSectionSummary}
          @asset-record-changed=${this.updateAssetRecord}
        ></k4-form>`;
      })}

      <div class="add-page">
        <ss-button @click=${this.addPage}>${translate('addPage')}</ss-button>
      </div>

      ${this.settings.showPreview
        ? html`<section>
            <file-preview>
              <div slot="info">${this.info}</div>
              <div slot="blanketter">${this.blanketter}</div>
            </file-preview>
          </section>`
        : nothing}
    </div> `;
  }
}
