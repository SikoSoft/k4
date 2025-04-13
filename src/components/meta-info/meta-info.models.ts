import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum MetaInfoProp {
  YEAR = 'year',
  DATE = 'date',
  PAGE_NUMBER = 'pageNumber',
}

export interface MetaInfoProps extends PropTypes {
  [MetaInfoProp.YEAR]: string;
  [MetaInfoProp.DATE]: string;
  [MetaInfoProp.PAGE_NUMBER]: string;
}

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
