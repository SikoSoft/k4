import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import {
  ImportModalProp,
  importModalProps,
  ImportModalProps,
} from './import-modal.models';
import { ImportSruEvent, ImportSruEventPayload } from './import-modal.events';
import { translate } from '@/lib/Localization';
import { K4 } from '@/lib/K4';

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

  @query('#file-upload')
  private fileUpload!: HTMLInputElement;

  @state()
  private isFileSelected = false;

  @state()
  private fileName = '';

  @state()
  manifest = '';

  @state()
  data = '';

  @query('#import-data')
  private importDataField!: HTMLTextAreaElement;

  protected updated(_changedProperties: PropertyValues): void {
    super.updated(_changedProperties);

    //this.importDataField.focus();
  }

  protected firstUpdated(): void {
    // Add event listener for file selection
    this.fileUpload.addEventListener(
      'change',
      this.handleFileSelected.bind(this),
    );
  }

  handleFileSelected(event: Event) {
    const fileInput = event.target as HTMLInputElement;
    const file = fileInput.files?.[0];

    if (file) {
      this.isFileSelected = true;
      this.fileName = file.name;

      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;

        if (K4.isContentData(content)) {
          console.log('Data content detected');
          this.data = content;
          //this.importDataField.value = content;
        }

        if (K4.isContentManifest(content)) {
          console.log('Manifest content detected');
          this.manifest = content;
        }
      };
      reader.onerror = () => {
        console.error('Error reading file');
      };

      reader.readAsText(file);
    } else {
      this.isFileSelected = false;
      this.fileName = '';
    }
  }

  import() {
    console.log('import');
    const manifest = this.manifest; //importDataField.value;
    const data = this.data; //importDataField.value;
    this.sendChangedEvent({ manifest, data });
    //this.importDataField.value = '';
  }

  sendChangedEvent(payload: ImportSruEventPayload) {
    console.log('sendChangedEvent', payload);
    this.dispatchEvent(new ImportSruEvent(payload));
  }

  render() {
    return html`<div class="person-info">
      ${this.manifest
        ? html`<div>${translate('manifestDetected')}</div>`
        : nothing}
      ${this.data ? html`<div>${translate('dataDetected')}</div>` : nothing}

      <input type="file" id="file-upload" accept=".sru" />

      <ss-button @click=${this.import}>${translate('import')}</ss-button>
    </div> `;
  }
}
