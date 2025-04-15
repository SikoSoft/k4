import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum PersonInfoProp {
  NAME = 'name',
  PERSON_NUMBER = 'personNumber',
  CITY = 'city',
  POST_CODE = 'postCode',
}

export interface PersonInfoProps extends PropTypes {
  [PersonInfoProp.NAME]: string;
  [PersonInfoProp.PERSON_NUMBER]: string;
  [PersonInfoProp.CITY]: string;
  [PersonInfoProp.POST_CODE]: string;
}

export const personInfoProps: PropConfigMap<PersonInfoProps> = {
  [PersonInfoProp.NAME]: {
    default: '',
    control: 'text',
    description: 'Name of the person',
  },
  [PersonInfoProp.PERSON_NUMBER]: {
    default: '',
    control: 'text',
    description: 'Person number of the person',
  },
  [PersonInfoProp.CITY]: {
    default: '',
    control: 'text',
    description: 'City of the person',
  },
  [PersonInfoProp.POST_CODE]: {
    default: '',
    control: 'text',
    description: 'Post code of the person',
  },
};
