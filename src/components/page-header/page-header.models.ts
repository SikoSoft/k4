import { ValidationResult } from '@/models/K4';
import { PropConfigMap } from '@/models/Prop';

export enum PageHeaderProp {
  VALIDATION_RESULT = 'validationResult',
}

export interface PageHeaderProps {
  [PageHeaderProp.VALIDATION_RESULT]: ValidationResult;
}

export const pageHeaderProps: PropConfigMap<PageHeaderProps> = {
  [PageHeaderProp.VALIDATION_RESULT]: {
    default: { isValid: true, errors: [] },
    control: 'text',
    description: 'Validation result of the form content',
  },
};
