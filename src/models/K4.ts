export enum AssetRecordField {
  TOTAL = 'total',
  ASSET = 'asset',
  SELL_PRICE = 'sellPrice',
  BUY_PRICE = 'buyPrice',
  GAIN = 'gain',
  LOSS = 'loss',
}

export interface AssetRecord {
  [AssetRecordField.TOTAL]: number;
  [AssetRecordField.ASSET]: string;
  [AssetRecordField.SELL_PRICE]: number;
  [AssetRecordField.BUY_PRICE]: number;
  [AssetRecordField.GAIN]: number;
  [AssetRecordField.LOSS]: number;
}
