import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import {
  ImportModalProp,
  importModalProps,
  ImportModalProps,
} from './import-modal.models';
import { ImportSruEvent, ImportSruEventPayload } from './import-modal.events';
import { translate } from '@/lib/Localization';

@customElement('import-modal')
export class ImportModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    textarea {
      width: 100%;
      height: 10rem;
      margin-bottom: 1rem;
    }
  `;

  @query('#import-data')
  private importDataField!: HTMLTextAreaElement;

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    this.importDataField.focus();
  }

  import() {
    const manifest = this.importDataField.value;
    const data = this.importDataField.value;
    this.sendChangedEvent({ manifest, data });
    this.importDataField.value = '';
  }

  sendChangedEvent(payload: ImportSruEventPayload) {
    this.dispatchEvent(new ImportSruEvent(payload));
  }

  render() {
    return html`<div class="person-info">
      <textarea id="import-data"></textarea>

      <ss-button @click=${this.import}>${translate('import')}</ss-button>
    </div> `;
  }
}
