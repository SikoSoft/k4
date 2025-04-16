import { PropConfigMap } from '@/models/Prop';
import { MetaInfo, MetaInfoField as MetaInfoProp } from '@/models/K4';

export { MetaInfoProp };

export interface MetaInfoProps extends MetaInfo {}

export const metaInfoProps: PropConfigMap<MetaInfoProps> = {
  [MetaInfoProp.YEAR]: {
    default: `${new Date().getFullYear()}`,
    control: 'text',
    description: 'Tax year in which this information is for',
  },
  [MetaInfoProp.DATE]: {
    default: '',
    control: 'text',
    description: 'Date this form was filled in',
  },
  [MetaInfoProp.PAGE_NUMBER]: {
    default: `1`,
    control: 'text',
    description: 'Page number of the form',
  },
};
