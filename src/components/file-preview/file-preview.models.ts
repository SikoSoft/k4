import { PropConfigMap, PropTypes } from '@/models/Prop';

export enum FilePreviewProp {
  MANIFEST = 'manifest',
  DATA = 'data',
}

export interface FilePreviewProps extends PropTypes {
  [FilePreviewProp.MANIFEST]: string;
  [FilePreviewProp.DATA]: string;
}

export const filePreviewProps: PropConfigMap<FilePreviewProps> = {
  [FilePreviewProp.MANIFEST]: {
    default: '',
    control: 'text',
    description: 'Manifest content',
  },
  [FilePreviewProp.DATA]: {
    default: '',
    control: 'text',
    description: 'Data content',
  },
};
