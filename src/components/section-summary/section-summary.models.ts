import { PropConfigMap } from '@/models/Prop';
import {
  SectionSummary,
  SectionSummaryField as SectionSummaryProp,
} from '@/models/K4';

export { SectionSummaryProp };

export interface SectionSummaryProps extends SectionSummary {}

export const sectionSummaryProps: PropConfigMap<SectionSummaryProps> = {
  [SectionSummaryProp.TOTAL_SELL_PRICE]: {
    default: 0,
    control: 'number',
    description: 'Total amount of all assets sold',
  },
  [SectionSummaryProp.TOTAL_BUY_PRICE]: {
    default: 0,
    control: 'number',
    description: 'Total amount of all assets bought',
  },
  [SectionSummaryProp.TOTAL_GAIN]: {
    default: 0,
    control: 'number',
    description: 'Total gain from all assets',
  },
  [SectionSummaryProp.TOTAL_LOSS]: {
    default: 0,
    control: 'number',
    description: 'Total loss from all assets',
  },
};
