import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum AssetRecordProp {
  TOTAL = 'total',
  ASSET = 'asset',
  SELL_PRICE = 'sellPrice',
  BUY_PRICE = 'buyPrice',
  GAIN = 'gain',
  LOSS = 'loss',
}

export interface AssetRecordProps extends PropTypes {
  [AssetRecordProp.TOTAL]: number;
  [AssetRecordProp.ASSET]: string;
  [AssetRecordProp.SELL_PRICE]: number;
  [AssetRecordProp.BUY_PRICE]: number;
  [AssetRecordProp.GAIN]: number;
  [AssetRecordProp.LOSS]: number;
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
};
