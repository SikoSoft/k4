import { PropConfigMap } from '@/models/Prop';
import { AssetRecord, AssetRecordField, SectionType } from '@/models/K4';

export enum AssetRecordProp {
  TOTAL = AssetRecordField.TOTAL,
  ASSET = AssetRecordField.ASSET,
  SELL_PRICE = AssetRecordField.SELL_PRICE,
  BUY_PRICE = AssetRecordField.BUY_PRICE,
  GAIN = AssetRecordField.GAIN,
  LOSS = AssetRecordField.LOSS,
  SECTION = 'section',
  ROW = 'row',
}
export interface AssetRecordProps extends AssetRecord {
  [AssetRecordProp.SECTION]: SectionType;
  [AssetRecordProp.ROW]: number;
}

export const assetRecordProps: PropConfigMap<AssetRecordProps> = {
  [AssetRecordProp.TOTAL]: {
    default: 0,
    control: 'number',
    description: 'Amount of the asset sold',
  },
  [AssetRecordProp.ASSET]: {
    default: '',
    control: 'text',
    description: 'Name of the asset',
  },
  [AssetRecordProp.SELL_PRICE]: {
    default: 0,
    control: 'number',
    description: 'Sell price of the asset',
  },
  [AssetRecordProp.BUY_PRICE]: {
    default: 0,
    control: 'number',
    description: 'Buy price of the asset',
  },
  [AssetRecordProp.GAIN]: {
    default: 0,
    control: 'number',
    description: 'Gain from the asset',
  },
  [AssetRecordProp.LOSS]: {
    default: 0,
    control: 'number',
    description: 'Loss from the asset',
  },
  [AssetRecordProp.SECTION]: {
    default: SectionType.A,
    control: 'text',
    description: 'Section of the asset',
  },
  [AssetRecordProp.ROW]: {
    default: 0,
    control: 'number',
    description: 'Row number of the section',
  },
};
