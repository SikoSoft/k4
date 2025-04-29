import { K4 } from '@/lib/K4';
import {
  DEFAULT_SECTION_SUMMARY,
  DeferredShare,
  RecordMatrix,
  SectionSummaryMatrix,
} from '@/models/K4';
import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum AssetInfoProp {
  DEFERRED_SHARE = 'deferredShare',
  RECORD_MATRIX = 'recordMatrix',
  SUMMARY_MATRIX = 'summaryMatrix',
  PAGE = 'page',
}

export interface AssetInfoProps extends PropTypes {
  [AssetInfoProp.DEFERRED_SHARE]: DeferredShare;
  [AssetInfoProp.RECORD_MATRIX]: RecordMatrix;
  [AssetInfoProp.SUMMARY_MATRIX]: SectionSummaryMatrix;
  [AssetInfoProp.PAGE]: number;
}

export const assetInfoProps: PropConfigMap<AssetInfoProps> = {
  [AssetInfoProp.DEFERRED_SHARE]: {
    default: { deferredShareDesignation: '', deferredShareAmount: 0 },
    control: 'text',
    description: 'Deferred share designation and amount',
  },
  [AssetInfoProp.RECORD_MATRIX]: {
    default: K4.prepareRecordMatrix(),
    control: 'text',
    description: 'Matrix of asset records',
  },
  [AssetInfoProp.SUMMARY_MATRIX]: {
    default: DEFAULT_SECTION_SUMMARY,
    control: 'text',
    description: 'Matrix of asset summaries',
  },
  [AssetInfoProp.PAGE]: {
    default: 1,
    control: 'number',
    description: 'Page number of the form',
  },
};
