import { PropConfigMap } from '@/models/Prop';
import { SectionSummary, SectionSummaryField, SectionType } from '@/models/K4';

export enum SectionSummaryProp {
  TOTAL_SELL_PRICE = SectionSummaryField.TOTAL_SELL_PRICE,
  TOTAL_BUY_PRICE = SectionSummaryField.TOTAL_BUY_PRICE,
  TOTAL_GAIN = SectionSummaryField.TOTAL_GAIN,
  TOTAL_LOSS = SectionSummaryField.TOTAL_LOSS,
  SECTION = 'section',
  PAGE = 'page',
}
export interface SectionSummaryProps extends SectionSummary {
  [SectionSummaryProp.SECTION]: SectionType;
  [SectionSummaryProp.PAGE]: number;
}

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
  [SectionSummaryProp.SECTION]: {
    default: SectionType.A,
    control: 'text',
    description: 'Section of the summary',
  },
  [SectionSummaryProp.PAGE]: {
    default: 1,
    control: 'number',
    description: 'Page number of the form',
  },
};
