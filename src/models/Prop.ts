export type PropTypes = Record<string, any>;

export type PropControlType<T> = T extends boolean
  ? 'boolean'
  : T extends number
    ? 'number'
    : 'text';

export type PropConfigMap<Props extends PropTypes> = {
  [Property in keyof Props]: {
    default: Props[Property];
    control: PropControlType<Props[Property]>;
    description: string;
  };
};
