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

export interface SectionSummary {
  totalSellPrice: number;
  totalBuyPrice: number;
  totalGain: number;
  totalLoss: number;
}

export enum SectionType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export interface Section {
  type: SectionType;
  records: AssetRecord[];
  summary: SectionSummary;
}

export interface SectionConfig {
  type: SectionType;
  numRecords: number;
}

export type SectionConfigMap = Record<SectionType, SectionConfig>;

export const sectionConfigMap: SectionConfigMap = {
  [SectionType.A]: {
    type: SectionType.A,
    numRecords: 9,
  },
  [SectionType.B]: {
    type: SectionType.B,
    numRecords: 0,
  },
  [SectionType.C]: {
    type: SectionType.C,
    numRecords: 7,
  },
  [SectionType.D]: {
    type: SectionType.D,
    numRecords: 7,
  },
};
