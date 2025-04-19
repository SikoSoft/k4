import { css, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

import '@ss/ui/components/ss-button';

import '@/components/meta-info/meta-info';
import '@/components/person-info/person-info';
import '@/components/asset-record/asset-record';
import '@/components/section-summary/section-summary';
import '@/components/file-preview/file-preview';

import { AssetRecordChangedEvent } from '@/components/asset-record/asset-record.events';
import { PersonInfoChangedEvent } from '@/components/person-info/person-info.events';
import { MetaInfoChangedEvent } from '@/components/meta-info/meta-info.events';
import {
  AssetFieldConfig,
  assetFieldMap,
  AssetRecord,
  AssetRecordField,
  MetaInfo,
  PersonInfo,
  PersonInfoField,
  RecordMatrix,
  sectionConfigMap,
  SectionSummary,
  SectionSummaryField,
  SectionSummaryMatrix,
  SectionType,
  SummaryFieldConfig,
  summaryFieldMap,
  ValidationError,
  ValidationResult,
} from '@/models/K4';
import { SectionSummaryChangedEvent } from '../section-summary/section-summary.events';
import { translate } from '@/lib/Localization';

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
  private summaryMatrix: SectionSummaryMatrix = {
    [SectionType.A]: {
      totalSellPrice: 0,
      totalBuyPrice: 0,
      totalGain: 0,
      totalLoss: 0,
    },
    [SectionType.B]: {
      totalSellPrice: 0,
      totalBuyPrice: 0,
      totalGain: 0,
      totalLoss: 0,
    },
    [SectionType.C]: {
      totalSellPrice: 0,
      totalBuyPrice: 0,
      totalGain: 0,
      totalLoss: 0,
    },
    [SectionType.D]: {
      totalSellPrice: 0,
      totalBuyPrice: 0,
      totalGain: 0,
      totalLoss: 0,
    },
  };

  @state()
  metaInfo: MetaInfo = {
    year: `2024`,
    date: '',
    pageNumber: '1',
  };

  @state()
  personInfo: PersonInfo = {
    name: '',
    personNumber: '',
    city: '',
    postCode: '',
  };

  @state()
  programName = 'SikoSoft K4';

  @state()
  validationResult: ValidationResult = {
    isValid: false,
    errors: [],
  };

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
  get manifest(): string {
    return `#DATABESKRIVNING_START
#PRODUKT SRU
#SKAPAD ${this.createdDate}
#PROGRAM ${this.programName}
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
  get data(): string {
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
  }

  prepareRecordMatrix(): RecordMatrix {
    const recordMatrix = Object.keys(sectionConfigMap).reduce(
      (acc, key) => {
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
      },
      {} as Record<SectionType, AssetRecord[]>,
    );
    console.log('recordMatrix', recordMatrix);
    return recordMatrix;
  }

  updateMetaInfo(event: MetaInfoChangedEvent) {
    console.log('updateMetaInfo', event.detail);
    this.metaInfo = event.detail;
  }

  updatePersonInfo(event: PersonInfoChangedEvent) {
    console.log('updatePersonInfo', event.detail);
    this.personInfo = event.detail;
  }

  updateSectionSummary(section: SectionType, summary: SectionSummary) {
    console.log('updateSectionSummary', summary);
    this.summaryMatrix[section] = summary;
    this.requestUpdate();
  }

  updateAssetRecord(section: SectionType, index: number, record: AssetRecord) {
    console.log('updateAssetRecord', section, index, record);
    this.recordMatrix[section][index] = record;
    this.requestUpdate();
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
    console.log('validate');

    let validationResult: ValidationResult = {
      isValid: true,
      errors: [],
    };

    const missingFieldErrors = this.getMissingFieldErrors();
    if (missingFieldErrors.length > 0) {
      validationResult.isValid = false;
      validationResult.errors.push(...missingFieldErrors);
    }

    /*
    if (!this.allFieldsUseCorrectFormat()) {
      validationResult.isValid = false;
    }

    if (!this.allRequiredFieldsAreFilled()) {
      validationResult.isValid = false;
    }
      */

    this.validationResult = validationResult;
    return this.validationResult;
    /*
    const isValid = Object.keys(this.recordMatrix).every(key => {
      const sectionKey = key as SectionType;
      const records = this.recordMatrix[sectionKey];
      return records.every((record, index) =>
        this.sectionRowIsValid(sectionKey, index),
      );
    });

    if (isValid) {
      console.log('All sections are valid');
    } else {
      console.error('Some sections are invalid');
    }
      */
  }

  getMissingFieldErrors(): ValidationError[] {
    const errors: ValidationError[] = [];

    Object.values(PersonInfoField).forEach(field => {
      if (!this.personInfo[field]) {
        errors.push({
          field,
          message: translate(`missingFieldError.personInfo.${field}`),
        });
      }
    });

    return errors;
  }

  allRequiredFieldsAreFilled(): boolean {
    return false;
  }

  allFieldsUseCorrectFormat(): boolean {
    return false;
  }

  async download(): Promise<void> {
    try {
      const zip = new JSZip();

      zip.file('BLANKETTER.SRU', this.data);
      zip.file('INFO.SRU', this.manifest);

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

  render() {
    return html`<div class="k4">
      <section>
        <meta-info
          @meta-info-changed=${this.updateMetaInfo}
          year=${this.metaInfo.year}
          date=${this.metaInfo.date}
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

            ${repeat(
              [...new Array(sectionConfig.numRecords)].map((_, index) => index),
              index => index,
              index =>
                html` <asset-record
                  @asset-record-changed=${(event: AssetRecordChangedEvent) => {
                    this.updateAssetRecord(
                      sectionConfig.type,
                      index,
                      event.detail,
                    );
                  }}
                  total=${this.recordMatrix[sectionKey][index].total}
                  asset=${this.recordMatrix[sectionKey][index].asset}
                  sellPrice=${this.recordMatrix[sectionKey][index].sellPrice}
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

      <div class="validation">
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
      </div>

      <div class="download">
        <ss-button
          @click=${this.download}
          ?disabled=${!this.validationResult.isValid}
          >${translate('download')}</ss-button
        >
      </div>

      <section>
        <file-preview>
          <div slot="manifest">${this.manifest}</div>
          <div slot="data">${this.data}</div>
        </file-preview>
      </section>
    </div>`;
  }
}
