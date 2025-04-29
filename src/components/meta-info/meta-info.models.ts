import { PropConfigMap } from '@/models/Prop';
import { MetaInfo, MetaInfoField } from '@/models/K4';

export enum MetaInfoProp {
  YEAR = MetaInfoField.YEAR,
  PAGE_NUMBER = MetaInfoField.PAGE_NUMBER,
  PAGE = 'page',
}

export interface MetaInfoProps extends MetaInfo {
  [MetaInfoProp.PAGE]: number;
}

export const metaInfoProps: PropConfigMap<MetaInfoProps> = {
  [MetaInfoProp.YEAR]: {
    default: `${new Date().getFullYear()}`,
    control: 'text',
    description: 'Tax year in which this information is for',
  },
  [MetaInfoProp.PAGE_NUMBER]: {
    default: `1`,
    control: 'text',
    description: 'Page number of the form',
  },
  [MetaInfoProp.PAGE]: {
    default: 1,
    control: 'number',
    description: 'Page number of the form',
  },
};
