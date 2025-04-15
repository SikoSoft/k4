import { PropConfigMap } from '@/models/Prop';
import { PersonInfo, PersonInfoField as PersonInfoProp } from '@/models/K4';

export { PersonInfoProp };

export interface PersonInfoProps extends PersonInfo {}

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
