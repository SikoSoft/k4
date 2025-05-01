import { html, css, LitElement } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { LanguageController } from '@/components/language-controller/language-controller';

import '@ss/ui/components/ss-input';
import { InputChangedEvent } from '@ss/ui/events/input-changed';

import {
  AssetRecordProp,
  assetRecordProps,
  AssetRecordProps,
} from './asset-record.models';
import {
  AssetRecordChangedEvent,
  AssetRecordChangedEventPayload,
} from './asset-record.events';
import { AssetRecordField } from '@/models/K4';
import { translate } from '@/lib/Localization';
import { Language } from '@/models/Localization';

@customElement('asset-record')
export class AssetRecord extends LitElement {
  private languageController = new LanguageController(this);

  static styles = css`
    :host {
      display: block;
    }

    .asset-record {
      display: flex;
      flex-direction: row;
      gap: 1rem;
      justify-content: space-between;

      & > * {
        flex-grow: 1;
      }
    }
  `;

  @property({ type: Number })
  [AssetRecordProp.TOTAL]: AssetRecordProps[AssetRecordProp.TOTAL] =
    assetRecordProps[AssetRecordProp.TOTAL].default;

  @property({ type: String })
  [AssetRecordProp.ASSET]: AssetRecordProps[AssetRecordProp.ASSET] =
    assetRecordProps[AssetRecordProp.ASSET].default;

  @property({ type: Number })
  [AssetRecordProp.BUY_PRICE]: AssetRecordProps[AssetRecordProp.BUY_PRICE] =
    assetRecordProps[AssetRecordProp.BUY_PRICE].default;

  @property({ type: Number })
  [AssetRecordProp.SELL_PRICE]: AssetRecordProps[AssetRecordProp.SELL_PRICE] =
    assetRecordProps[AssetRecordProp.SELL_PRICE].default;

  @property({ type: Number })
  [AssetRecordProp.GAIN]: AssetRecordProps[AssetRecordProp.GAIN] =
    assetRecordProps[AssetRecordProp.GAIN].default;

  @property({ type: Number })
  [AssetRecordProp.LOSS]: AssetRecordProps[AssetRecordProp.LOSS] =
    assetRecordProps[AssetRecordProp.LOSS].default;

  @property({ type: String })
  [AssetRecordProp.SECTION]: AssetRecordProps[AssetRecordProp.SECTION] =
    assetRecordProps[AssetRecordProp.SECTION].default;

  @property({ type: Number })
  [AssetRecordProp.ROW]: AssetRecordProps[AssetRecordProp.ROW] =
    assetRecordProps[AssetRecordProp.ROW].default;

  @property({ type: Number })
  [AssetRecordProp.PAGE]: AssetRecordProps[AssetRecordProp.PAGE] =
    assetRecordProps[AssetRecordProp.PAGE].default;

  get rowHasData(): boolean {
    return Object.values(AssetRecordField).some(
      field => this[field] !== 0 && this[field] !== '',
    );
  }

  get language(): Language {
    return this.languageController.language;
  }

  fieldValue(field: AssetRecordField): string {
    if (
      field === AssetRecordField.TOTAL &&
      this[AssetRecordField.TOTAL] === 0 &&
      this.rowHasData
    ) {
      return this[field].toString();
    }

    if (
      field === AssetRecordField.BUY_PRICE &&
      this[AssetRecordField.BUY_PRICE] === 0 &&
      this.rowHasData
    ) {
      return this[field].toString();
    }

    return this[field] === 0 ? '' : this[field].toString();
  }

  handleFieldChanged(field: AssetRecordField, event: InputChangedEvent) {
    const value: string | number =
      assetRecordProps[field].control === 'text'
        ? event.detail.value
        : isNaN(parseInt(event.detail.value || '0'))
          ? 0
          : parseInt(event.detail.value || '0');

    this.sendChangedEvent({
      ...(Object.fromEntries(
        Object.values(AssetRecordField).map(key => [key, this[key]]),
      ) as unknown as AssetRecordProps),
      [field]: value,
      section: this.section,
      row: this.row,
      page: this.page,
    });
  }

  sendChangedEvent(payload: AssetRecordChangedEventPayload) {
    this.dispatchEvent(new AssetRecordChangedEvent(payload));
  }

  render() {
    return html`<div class="asset-record" data-language=${this.language}>
      ${repeat(
        Object.values(AssetRecordField),
        field => field,
        field => html`
          <ss-input
            placeholder=${translate(
              `fieldPlaceholder.${this.section}.record.${field}`,
            )}
            value=${this.fieldValue(field)}
            @input-changed=${(event: InputChangedEvent) => {
              this.handleFieldChanged(field, event);
            }}
          ></ss-input>
        `,
      )}
    </div> `;
  }
}
