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
import JSZip from 'jszip';

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

  async handleZipFile(file: File) {
    try {
      // Use JSZip to read the zip file
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(file);

      // Process each file in the zip
      const filePromises: Promise<void>[] = [];

      zipContents.forEach((relativePath, zipEntry) => {
        // Skip directories
        if (zipEntry.dir) return;

        // Process only text files
        const filePromise = zipEntry.async('string').then(content => {
          const filename = zipEntry.name.toLowerCase();

          // Check file content and assign to appropriate state variables
          if (
            filename.includes('databeskrivning') ||
            filename.endsWith('.manifest.sru')
          ) {
            console.log(`Found manifest file: ${filename}`);
            this.manifest = content;
          } else if (
            filename.includes('blankett') ||
            filename.endsWith('.data.sru')
          ) {
            console.log(`Found data file: ${filename}`);
            this.data = content;
          } else {
            // Try to detect content type if filename doesn't provide clues
            if (K4.isContentData(content)) {
              console.log(`Detected data content in: ${filename}`);
              this.data = content;
            } else if (K4.isContentManifest(content)) {
              console.log(`Detected manifest content in: ${filename}`);
              this.manifest = content;
            }
          }
        });

        filePromises.push(filePromise);
      });

      // Wait for all files to be processed
      await Promise.all(filePromises);

      // Request update after processing all files
      this.requestUpdate();

      // Give feedback to user about what was found
      if (!this.manifest && !this.data) {
        console.warn('No valid files found in ZIP');
      }
    } catch (error) {
      console.error('Error processing ZIP file:', error);
    }
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

        if (this.fileName.endsWith('.zip')) {
          console.log('ZIP file detected');
          this.handleZipFile(file);
          return;
        }

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

      <input type="file" id="file-upload" accept=".sru,.zip" />

      <ss-button @click=${this.import}>${translate('import')}</ss-button>
    </div> `;
  }
}
