import { PropConfigMap } from '@/models/Prop';
import {
  DeferredShare,
  DeferredShareField as DeferredShareProp,
} from '@/models/K4';

export { DeferredShareProp };

export interface DeferredShareProps extends DeferredShare {}

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
};
