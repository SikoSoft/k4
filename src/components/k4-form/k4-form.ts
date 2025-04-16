import { css, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

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
  RecordMatrix,
  SectionConfigMap,
  sectionConfigMap,
  SectionSummary,
  SectionSummaryField,
  SectionSummaryMatrix,
  SectionType,
  SummaryFieldConfig,
  summaryFieldMap,
} from '@/models/K4';
import { SectionSummaryChangedEvent } from '../section-summary/section-summary.events';

@customElement('k4-form')
export class K4Form extends LitElement {
  static styles = [
    css`
      section {
        margin-bottom: 1rem;

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
    year: '',
    date: '',
    pageNumber: '',
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
        Object.values(AssetRecordField).forEach(field => {
          const fieldEntry = assetFieldMap.find(
            (entry: AssetFieldConfig) =>
              entry.location[0] === sectionKey &&
              entry.location[1] === index &&
              entry.location[2] === field,
          );

          if (fieldEntry) {
            const fieldValue = record[field];
            data += `#UPPGIFT ${fieldEntry.id} ${fieldValue}\n`;
          }
        });
      });

      //const summary = this.summaryMatrix[sectionKey];
      Object.values(SectionSummaryField).forEach(field => {
        const fieldEntry = summaryFieldMap.find(
          (entry: SummaryFieldConfig) =>
            entry.location[0] === sectionKey && entry.location[1] === field,
        );

        if (fieldEntry) {
          const fieldValue = this.summaryMatrix[sectionKey][field];
          data += `#UPPGIFT ${fieldEntry.id} ${fieldValue}\n`;
        }
      });
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
          return html`<section>
            <h3>${sectionConfig.type}</h3>

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
          </section> `;
        },
      )}

      <section>
        <file-preview>
          <div slot="manifest">${this.manifest}</div>
          <div slot="data">${this.data}</div>
        </file-preview>
      </section>
    </div>`;
  }
}
