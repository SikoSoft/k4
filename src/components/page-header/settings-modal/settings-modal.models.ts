import { PropConfigMap, PropTypes } from '@/models/Prop';
import { DEFAULT_SETTINGS, Settings } from '@/models/Settings';

export enum SettingsModalProp {
  SETTINGS = 'settings',
}

export interface SettingsModalProps extends PropTypes {
  [SettingsModalProp.SETTINGS]: Settings;
}

export const settingsModalProps: PropConfigMap<SettingsModalProps> = {
  [SettingsModalProp.SETTINGS]: {
    default: DEFAULT_SETTINGS,
    control: 'text',
    description: 'Settings configuration for the application',
  },
};
