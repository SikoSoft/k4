import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('credit-bar')
export class CreditBar extends LitElement {
  static styles = css`
    :host {
      display: block;
      text-align: center;
      font-size: 0.9rem;
      color: #fff;
      margin: -2rem;
      padding-bottom: 2rem;
    }

    .credit-bar {
      background-color: rgba(0, 0, 0, 1);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .left {
      a {
        color: #fff;
        text-decoration: none;
        font-weight: bold;
      }
    }

    .github-icon {
      width: 2rem;
      height: 2rem;
      border: 0;
      opacity: 0.75;
      transition: all 0.3s;

      &:hover {
        opacity: 1;
      }
    }
  `;

  render(): TemplateResult {
    return html`
      <div class="credit-bar">
        <div class="left">
          Created with ♥ by <a href="https://sikosoft.com">Aaron Wright</a>
        </div>
        <div class="right">
          <a href="https://github.com/SikoSoft/k4"
            ><img src="./GitHub_Invertocat_White.png" class="github-icon"
          /></a>
        </div>
      </div>
    `;
  }
}
