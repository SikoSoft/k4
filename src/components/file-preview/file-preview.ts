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

      .info,
      .blanketter {
        flex: 1;
        background-color: var(--ss-color-background);
        border-radius: 0.5rem;
        padding: 1rem;
        box-shadow: 0 0 1rem rgba(0, 0, 0, 0.1);
        overflow: auto;
        max-height: 400px;
      }
    }
  `;

  render() {
    return html`<div class="file-preview">
      <div class="info">
        <pre>
          <code>
            <slot name="info"></slot>
          </code>
        </pre>
      </div>
      <div class="blanketter">
        <pre>
          <code>
            <slot name="blanketter"></slot>
          </code>
        </pre>
      </div>
    </div> `;
  }
}
