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
  AssetRecord,
  MetaInfo,
  PersonInfo,
  RecordMatrix,
  SectionConfigMap,
  sectionConfigMap,
  SectionType,
} from '@/models/K4';

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
  private recordMatrix: RecordMatrix = {};

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
    return JSON.stringify(this.recordMatrix);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.recordMatrix = this.prepareRecordMatrix();
  }

  prepareRecordMatrix() {
    const recordMatrix = Object.keys(sectionConfigMap).reduce(
      (acc, sectionKey) => {
        const sectionConfig =
          sectionConfigMap[sectionKey as keyof SectionConfigMap];
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
      {} as Record<string, AssetRecord[]>,
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
        sectionKey => {
          const sectionConfig =
            sectionConfigMap[sectionKey as keyof SectionConfigMap];
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
              ? html` <section-summary></section-summary> `
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
