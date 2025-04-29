import { PropConfigMap } from '@/models/Prop';
import { PersonInfo, PersonInfoField } from '@/models/K4';

export enum PersonInfoProp {
  NAME = PersonInfoField.NAME,
  PERSON_NUMBER = PersonInfoField.PERSON_NUMBER,
  CITY = PersonInfoField.CITY,
  POST_CODE = PersonInfoField.POST_CODE,
  PAGE = 'page',
}

export interface PersonInfoProps extends PersonInfo {
  [PersonInfoProp.PAGE]: number;
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
  [PersonInfoProp.PAGE]: {
    default: 1,
    control: 'number',
    description: 'Page number of the form',
  },
};
