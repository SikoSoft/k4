import { PropConfigMap } from '@/models/Prop';
import { DeferredShare, DeferredShareField } from '@/models/K4';

export enum DeferredShareProp {
  DEFERRED_SHARE_DESIGNATION = DeferredShareField.DEFERRED_SHARE_DESIGNATION,
  DEFERRED_SHARE_AMOUNT = DeferredShareField.DEFERRED_SHARE_AMOUNT,
  PAGE = 'page',
}

export interface DeferredShareProps extends DeferredShare {
  [DeferredShareProp.PAGE]: number;
}

export const deferredShareProps: PropConfigMap<DeferredShareProps> = {
  [DeferredShareProp.DEFERRED_SHARE_DESIGNATION]: {
    default: '',
    control: 'text',
    description: 'Deferred share designation',
  },
  [DeferredShareProp.DEFERRED_SHARE_AMOUNT]: {
    default: 0,
    control: 'number',
    description: 'Deferred share amount',
  },
  [DeferredShareProp.PAGE]: {
    default: 1,
    control: 'number',
    description: 'Page number of the form',
  },
};
