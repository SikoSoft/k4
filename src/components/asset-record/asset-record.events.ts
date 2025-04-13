import { AssetRecord } from '@/models/K4';

export const assetRecordChangedEventName = 'asset-record-changed';

export interface AssetRecordChangedEventPayload extends AssetRecord {}

export class AssetRecordChangedEvent extends CustomEvent<AssetRecordChangedEventPayload> {
  constructor(payload: AssetRecordChangedEventPayload) {
    super(assetRecordChangedEventName, {
      bubbles: true,
      composed: true,
      detail: payload,
    });
  }
}
