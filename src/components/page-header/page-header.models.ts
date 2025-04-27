import { ValidationResult } from '@/models/K4';
import { PropConfigMap } from '@/models/Prop';
import { DEFAULT_SETTINGS, Settings } from '@/models/Settings';

export enum PageHeaderProp {
  VALIDATION_RESULT = 'validationResult',
  SETTINGS = 'settings',
}

export interface PageHeaderProps {
  [PageHeaderProp.VALIDATION_RESULT]: ValidationResult;
  [PageHeaderProp.SETTINGS]: Settings;
}

export const pageHeaderProps: PropConfigMap<PageHeaderProps> = {
  [PageHeaderProp.VALIDATION_RESULT]: {
    default: { isValid: true, errors: [] },
    control: 'text',
    description: 'Validation result of the form content',
  },
  [PageHeaderProp.SETTINGS]: {
    default: DEFAULT_SETTINGS,
    control: 'text',
    description: 'Settings configuration for the application',
  },
};
