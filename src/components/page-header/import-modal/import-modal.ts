import { css, html, LitElement, nothing, PropertyValues } from 'lit';
import { customElement, query, state } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import '@ss/ui/components/ss-icon';
import { ImportSruEvent, ImportSruEventPayload } from './import-modal.events';
import { translate } from '@/lib/Localization';
import { K4 } from '@/lib/K4';
import JSZip from 'jszip';
import { FileName } from '@/models/K4';

const manifest = FileName.MANIFEST;
const data = FileName.DATA;

@customElement('import-modal')
export class ImportModal extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .file {
      text-align: center;
      padding: 1rem;
      margin: 1rem 0;
    }

    .files-provided {
      list-style: none;
      padding: 0;
      margin: 0;
      font-family: monospace;
      color: #666;
      padding: 1rem;
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
  }

  protected firstUpdated(): void {
    this.fileUpload.addEventListener(
      'change',
      this.handleFileSelected.bind(this),
    );
  }

  async handleZipFile(file: File) {
    try {
      const zip = new JSZip();
      const zipContents = await zip.loadAsync(file);

      const filePromises: Promise<void>[] = [];

      zipContents.forEach((relativePath, zipEntry) => {
        if (zipEntry.dir) {
          return;
        }

        const filePromise = zipEntry.async('string').then(content => {
          const filename = zipEntry.name.toLowerCase();

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

      await Promise.all(filePromises);

      this.requestUpdate();

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
          this.handleZipFile(file);
        }

        if (K4.isContentData(content)) {
          this.data = content;
        }

        if (K4.isContentManifest(content)) {
          this.manifest = content;
        }

        fileInput.value = '';
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
    const manifest = this.manifest;
    const data = this.data;
    this.sendChangedEvent({ manifest, data });
  }

  sendChangedEvent(payload: ImportSruEventPayload) {
    this.dispatchEvent(new ImportSruEvent(payload));
  }

  render() {
    return html`<div class="import-modal">
      <p>${translate('fileImportInfo', { manifest, data })}</p>

      <ul class="files-provided">
        <li>
          ${this.manifest
            ? html`<ss-icon name="validCircle" size="20" color="#084"></ss-icon>
                ${translate('manifestDetected', { manifest })}`
            : html`<ss-icon
                  name="invalidCircle"
                  size="20"
                  color="#920"
                ></ss-icon>
                ${translate('manifestNotDetected', { manifest })}`}
        </li>
        <li>
          ${this.data
            ? html`<ss-icon name="validCircle" size="20" color="#084"></ss-icon>
                ${translate('dataDetected', { data })}`
            : html`<ss-icon
                  name="invalidCircle"
                  size="20"
                  color="#920"
                ></ss-icon>
                ${translate('dataNotDetected', { data })}`}
        </li>
      </ul>

      <div class="file">
        <input type="file" id="file-upload" accept=".sru,.zip" />
      </div>

      <ss-button @click=${this.import} ?disabled=${!this.manifest || !this.data}
        >${translate('import')}</ss-button
      >
    </div> `;
  }
}
