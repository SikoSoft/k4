import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum PersonInfoProp {
  NAME = 'name',
  PERSON_NUMBER = 'personNumber',
}

export interface PersonInfoProps extends PropTypes {
  [PersonInfoProp.NAME]: string;
  [PersonInfoProp.PERSON_NUMBER]: string;
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
};
