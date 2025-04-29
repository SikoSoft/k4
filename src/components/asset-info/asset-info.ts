import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import '@/components/asset-record/asset-record';
import '@/components/section-summary/section-summary';

import {
  AssetInfoProp,
  assetInfoProps,
  AssetInfoProps,
} from './asset-info.models';
import { translate } from '@/lib/Localization';
import { repeat } from 'lit/directives/repeat.js';
import { sectionConfigMap, SectionType } from '@/models/K4';

@customElement('asset-info')
export class AssetInfo extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    fieldset,
    section {
      margin-bottom: 3rem;
      border-radius: 0.5rem;
    }

    asset-record {
      margin-bottom: 1rem;
    }
  `;

  @property({ type: Object })
  [AssetInfoProp.DEFERRED_SHARE]: AssetInfoProps[AssetInfoProp.DEFERRED_SHARE] =
    assetInfoProps[AssetInfoProp.DEFERRED_SHARE].default;

  @property({ type: Object })
  [AssetInfoProp.RECORD_MATRIX]: AssetInfoProps[AssetInfoProp.RECORD_MATRIX] =
    assetInfoProps[AssetInfoProp.RECORD_MATRIX].default;

  @property({ type: Object })
  [AssetInfoProp.SUMMARY_MATRIX]: AssetInfoProps[AssetInfoProp.SUMMARY_MATRIX] =
    assetInfoProps[AssetInfoProp.SUMMARY_MATRIX].default;

  @property({ type: Number })
  [AssetInfoProp.PAGE]: AssetInfoProps[AssetInfoProp.PAGE] =
    assetInfoProps[AssetInfoProp.PAGE].default;

  render() {
    return html`<div class="asset-info">
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
                    page=${this.page}
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
                      page=${this.page}
                      section=${sectionConfig.type}
                      row=${index}
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
                    page=${this.page}
                    section=${sectionConfig.type}
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
    </div> `;
  }
}
