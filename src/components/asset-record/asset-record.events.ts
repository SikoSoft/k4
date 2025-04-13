export const assetRecordChangedEventName = 'asset-record-changed';

export interface AssetRecordChangedEventPayload {}

export class AssetRecordChangedEvent extends CustomEvent<AssetRecordChangedEventPayload> {
  constructor(payload: AssetRecordChangedEventPayload) {
    super(assetRecordChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
