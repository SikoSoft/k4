import { css, html, LitElement, nothing } from 'lit';
import { customElement, state } from 'lit/decorators.js';

import '@/components/meta-info/meta-info';
import '@/components/person-info/person-info';
import '@/components/asset-record/asset-record';
import '@/components/section-summary/section-summary';

import { PersonInfoChangedEvent } from '../person-info/person-info.events';
import { MetaInfoChangedEvent } from '../meta-info/meta-info.events';
import {
  AssetRecord,
  RecordMatrix,
  SectionConfigMap,
  sectionConfigMap,
  SectionType,
} from '@/models/K4';
import { repeat } from 'lit/directives/repeat.js';
import {
  AssetRecordChangedEvent,
  AssetRecordChangedEventPayload,
} from '../asset-record/asset-record.events';

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

  private recordMatrix: RecordMatrix = {};

  @state()
  year = '';

  @state()
  date = '';

  @state()
  pageNumber = '';

  @state()
  name = '';

  @state()
  personNumber = '';

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
    const { year, date, pageNumber } = event.detail;
    console.log('updateMetaInfo', event.detail);
    this.year = year;
    this.date = date;
    this.pageNumber = pageNumber;
  }

  updatePersonInfo(event: PersonInfoChangedEvent) {
    const { name, personNumber } = event.detail;
    console.log('updatePersonInfo', event.detail);
    this.name = name;
    this.personNumber = personNumber;
  }

  updateAssetRecord(section: SectionType, index: number, record: AssetRecord) {
    console.log('updateAssetRecord', section, index, record);
    this.recordMatrix[section][index] = record;
  }

  render() {
    return html`<div class="k4">
      <section>
        <meta-info
          @meta-info-changed=${this.updateMetaInfo}
          year=${this.year}
          date=${this.date}
          pageNumber=${this.pageNumber}
        ></meta-info>
      </section>

      <section>
        <person-info
          @person-info-changed=${this.updatePersonInfo}
          name=${this.name}
          personNumber=${this.personNumber}
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
    </div>`;
  }
}
