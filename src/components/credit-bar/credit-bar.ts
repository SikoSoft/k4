import { css, html, LitElement, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { translate } from '@/lib/Localization';
import '@ss/ui/components/ss-button';

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

    ss-button {
      display: inline-block;
      vertical-align: middle;
      margin-right: 1rem;
    }

    .github-icon {
      display: inline-block;
      vertical-align: middle;
      width: 2rem;
      height: 2rem;
      border: 0;
      opacity: 0.75;
      transition: all 0.3s;

      &:hover {
        opacity: 1;
      }
    }

    .donation {
      color: #000;
      text-align: left;

      .message {
        margin-bottom: 1rem;
      }

      ul,
      li {
        margin: 0;
        padding: 0;
        list-style: none;
        text-align: center;
      }

      .currency {
        font-weight: bold;
      }
    }
  `;

  @state()
  private donateIsOpen = false;

  render(): TemplateResult {
    return html`
      <div class="credit-bar">
        <div class="left">
          Created with ♥ by <a href="https://sikosoft.com">Aaron Wright</a>
        </div>
        <div class="right">
          <ss-button @click=${() => (this.donateIsOpen = !this.donateIsOpen)}>
            ${translate('donate')}
          </ss-button>
          <a href="https://github.com/SikoSoft/k4"
            ><img src="./GitHub_Invertocat_White.png" class="github-icon"
          /></a>
        </div>
      </div>

      <pop-up
        closeButton
        closeOnEsc
        closeOnOutsideClick
        ?open=${this.donateIsOpen}
        @pop-up-closed=${() => (this.donateIsOpen = false)}
      >
        <div class="donation">
          <div class="message">${translate('donateMessage')}</div>
          <ul>
            <li>
              <span class="currency">BTC</span>:
              <code>bc1qqp9auka4ur7kljzqyuwcx7rrksp4n54eaqlqzy</code>
            </li>
            <li>
              <span class="currency">BCH</span>:
              <code
                >bitcoincash:qqnpkmgge90qh5xs38dtzfhrx8mp5nqk8gxazfesn0</code
              >
            </li>
            <li>
              <span class="currency">DOGE</span>:
              <code>DKprWAKptzHngpRSNRY9W6Tiu24WJkFBju</code>
            </li>
          </ul>
        </div></pop-up
      >
    `;
  }
}
