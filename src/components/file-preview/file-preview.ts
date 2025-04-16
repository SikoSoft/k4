import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import '@ss/ui/components/ss-input';
import {
  FilePreviewProp,
  filePreviewProps,
  FilePreviewProps,
} from './file-preview.models';

@customElement('file-preview')
export class FilePreview extends LitElement {
  static styles = css`
    :host {
      display: block;
    }

    .file-preview {
      display: flex;
      flex-direction: row;
      gap: 1rem;

      .year {
        flex-grow: 1;
      }
      .date {
        flex-grow: 1;
      }
      .page-number {
        flex-grow: 1;
      }
    }
  `;

  render() {
    return html`<div class="file-preview">
      <div class="manifest">
        <pre>
          <code>
            <slot name="manifest"></slot>
          </code>
        </pre>
      </div>
      <div class="data">
        <pre>
          <code>
            <slot name="data"></slot>
          </code>
        </pre>
      </div>
    </div> `;
  }
}
