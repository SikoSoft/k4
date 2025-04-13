import { PropConfigMap } from '@/models/Prop';
import { AssetRecord, AssetRecordField as AssetRecordProp } from '@/models/K4';

export { AssetRecordProp };

export interface AssetRecordProps extends AssetRecord {}

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
