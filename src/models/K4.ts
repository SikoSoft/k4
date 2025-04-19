export const APP_NAME = 'ss-k4-form';
export const STORAGE_KEY = 'k4-data';

export enum MetaInfoField {
  YEAR = 'year',
  DATE = 'date',
  PAGE_NUMBER = 'pageNumber',
}

export interface MetaInfo {
  [MetaInfoField.YEAR]: string;
  [MetaInfoField.DATE]: string;
  [MetaInfoField.PAGE_NUMBER]: string;
}

export enum PersonInfoField {
  NAME = 'name',
  PERSON_NUMBER = 'personNumber',
  CITY = 'city',
  POST_CODE = 'postCode',
}

export interface PersonInfo {
  [PersonInfoField.NAME]: string;
  [PersonInfoField.PERSON_NUMBER]: string;
  [PersonInfoField.CITY]: string;
  [PersonInfoField.POST_CODE]: string;
}

export enum AssetRecordField {
  TOTAL = 'total',
  ASSET = 'asset',
  SELL_PRICE = 'sellPrice',
  BUY_PRICE = 'buyPrice',
  GAIN = 'gain',
  LOSS = 'loss',
}

export interface AssetRecord {
  [AssetRecordField.TOTAL]: number;
  [AssetRecordField.ASSET]: string;
  [AssetRecordField.SELL_PRICE]: number;
  [AssetRecordField.BUY_PRICE]: number;
  [AssetRecordField.GAIN]: number;
  [AssetRecordField.LOSS]: number;
}

export enum SectionSummaryField {
  TOTAL_SELL_PRICE = 'totalSellPrice',
  TOTAL_BUY_PRICE = 'totalBuyPrice',
  TOTAL_GAIN = 'totalGain',
  TOTAL_LOSS = 'totalLoss',
}

export interface SectionSummary {
  [SectionSummaryField.TOTAL_SELL_PRICE]: number;
  [SectionSummaryField.TOTAL_BUY_PRICE]: number;
  [SectionSummaryField.TOTAL_GAIN]: number;
  [SectionSummaryField.TOTAL_LOSS]: number;
}

export enum SectionType {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
}

export type SectionSummaryMatrix = Record<SectionType, SectionSummary>;

export interface Section {
  type: SectionType;
  records: AssetRecord[];
  summary: SectionSummary;
}

export interface SectionConfig {
  type: SectionType;
  numRecords: number;
}

export type SectionConfigMap = Record<SectionType, SectionConfig>;

export const sectionConfigMap: SectionConfigMap = {
  [SectionType.A]: {
    type: SectionType.A,
    numRecords: 9,
  },
  [SectionType.B]: {
    type: SectionType.B,
    numRecords: 0,
  },
  [SectionType.C]: {
    type: SectionType.C,
    numRecords: 7,
  },
  [SectionType.D]: {
    type: SectionType.D,
    numRecords: 7,
  },
};

export type RecordMatrix = Record<SectionType, AssetRecord[]>;

export enum DeferredShareField {
  DEFERRED_SHARE_DESIGNATION = 'deferredShareDesignation',
  DEFERRED_SHARE_AMOUNT = 'deferredShareAmount',
}

export interface DeferredShare {
  [DeferredShareField.DEFERRED_SHARE_DESIGNATION]: string;
  [DeferredShareField.DEFERRED_SHARE_AMOUNT]: number;
}

export enum FileName {
  MANIFEST = 'info.sru',
  DATA = 'blanketter.sru',
}

export interface File {
  name: FileName;
  content: string;
}

export type AssetFieldMapping = [SectionType, number, AssetRecordField];

export interface AssetFieldConfig {
  id: number;
  location: AssetFieldMapping;
}

export const assetFieldMap: AssetFieldConfig[] = [
  { id: 3100, location: [SectionType.A, 0, AssetRecordField.TOTAL] },
  { id: 3101, location: [SectionType.A, 0, AssetRecordField.ASSET] },
  { id: 3102, location: [SectionType.A, 0, AssetRecordField.SELL_PRICE] },
  { id: 3103, location: [SectionType.A, 0, AssetRecordField.BUY_PRICE] },
  { id: 3104, location: [SectionType.A, 0, AssetRecordField.GAIN] },
  { id: 3105, location: [SectionType.A, 0, AssetRecordField.LOSS] },
  { id: 3110, location: [SectionType.A, 1, AssetRecordField.TOTAL] },
  { id: 3111, location: [SectionType.A, 1, AssetRecordField.ASSET] },
  { id: 3112, location: [SectionType.A, 1, AssetRecordField.SELL_PRICE] },
  { id: 3113, location: [SectionType.A, 1, AssetRecordField.BUY_PRICE] },
  { id: 3114, location: [SectionType.A, 1, AssetRecordField.GAIN] },
  { id: 3115, location: [SectionType.A, 1, AssetRecordField.LOSS] },
  { id: 3120, location: [SectionType.A, 2, AssetRecordField.TOTAL] },
  { id: 3121, location: [SectionType.A, 2, AssetRecordField.ASSET] },
  { id: 3122, location: [SectionType.A, 2, AssetRecordField.SELL_PRICE] },
  { id: 3123, location: [SectionType.A, 2, AssetRecordField.BUY_PRICE] },
  { id: 3124, location: [SectionType.A, 2, AssetRecordField.GAIN] },
  { id: 3125, location: [SectionType.A, 2, AssetRecordField.LOSS] },
  { id: 3130, location: [SectionType.A, 3, AssetRecordField.TOTAL] },
  { id: 3131, location: [SectionType.A, 3, AssetRecordField.ASSET] },
  { id: 3132, location: [SectionType.A, 3, AssetRecordField.SELL_PRICE] },
  { id: 3133, location: [SectionType.A, 3, AssetRecordField.BUY_PRICE] },
  { id: 3134, location: [SectionType.A, 3, AssetRecordField.GAIN] },
  { id: 3135, location: [SectionType.A, 3, AssetRecordField.LOSS] },
  { id: 3140, location: [SectionType.A, 4, AssetRecordField.TOTAL] },
  { id: 3141, location: [SectionType.A, 4, AssetRecordField.ASSET] },
  { id: 3142, location: [SectionType.A, 4, AssetRecordField.SELL_PRICE] },
  { id: 3143, location: [SectionType.A, 4, AssetRecordField.BUY_PRICE] },
  { id: 3144, location: [SectionType.A, 4, AssetRecordField.GAIN] },
  { id: 3145, location: [SectionType.A, 4, AssetRecordField.LOSS] },
  { id: 3150, location: [SectionType.A, 5, AssetRecordField.TOTAL] },
  { id: 3151, location: [SectionType.A, 5, AssetRecordField.ASSET] },
  { id: 3152, location: [SectionType.A, 5, AssetRecordField.SELL_PRICE] },
  { id: 3153, location: [SectionType.A, 5, AssetRecordField.BUY_PRICE] },
  { id: 3154, location: [SectionType.A, 5, AssetRecordField.GAIN] },
  { id: 3155, location: [SectionType.A, 5, AssetRecordField.LOSS] },
  { id: 3160, location: [SectionType.A, 6, AssetRecordField.TOTAL] },
  { id: 3161, location: [SectionType.A, 6, AssetRecordField.ASSET] },
  { id: 3162, location: [SectionType.A, 6, AssetRecordField.SELL_PRICE] },
  { id: 3163, location: [SectionType.A, 6, AssetRecordField.BUY_PRICE] },
  { id: 3164, location: [SectionType.A, 6, AssetRecordField.GAIN] },
  { id: 3165, location: [SectionType.A, 6, AssetRecordField.LOSS] },
  { id: 3170, location: [SectionType.A, 7, AssetRecordField.TOTAL] },
  { id: 3171, location: [SectionType.A, 7, AssetRecordField.ASSET] },
  { id: 3172, location: [SectionType.A, 7, AssetRecordField.SELL_PRICE] },
  { id: 3173, location: [SectionType.A, 7, AssetRecordField.BUY_PRICE] },
  { id: 3174, location: [SectionType.A, 7, AssetRecordField.GAIN] },
  { id: 3175, location: [SectionType.A, 7, AssetRecordField.LOSS] },
  { id: 3180, location: [SectionType.A, 8, AssetRecordField.TOTAL] },
  { id: 3181, location: [SectionType.A, 8, AssetRecordField.ASSET] },
  { id: 3182, location: [SectionType.A, 8, AssetRecordField.SELL_PRICE] },
  { id: 3183, location: [SectionType.A, 8, AssetRecordField.BUY_PRICE] },
  { id: 3184, location: [SectionType.A, 8, AssetRecordField.GAIN] },
  { id: 3185, location: [SectionType.A, 8, AssetRecordField.LOSS] },
  { id: 3310, location: [SectionType.C, 0, AssetRecordField.TOTAL] },
  { id: 3311, location: [SectionType.C, 0, AssetRecordField.ASSET] },
  { id: 3312, location: [SectionType.C, 0, AssetRecordField.SELL_PRICE] },
  { id: 3313, location: [SectionType.C, 0, AssetRecordField.BUY_PRICE] },
  { id: 3314, location: [SectionType.C, 0, AssetRecordField.GAIN] },
  { id: 3315, location: [SectionType.C, 0, AssetRecordField.LOSS] },
  { id: 3320, location: [SectionType.C, 1, AssetRecordField.TOTAL] },
  { id: 3321, location: [SectionType.C, 1, AssetRecordField.ASSET] },
  { id: 3322, location: [SectionType.C, 1, AssetRecordField.SELL_PRICE] },
  { id: 3323, location: [SectionType.C, 1, AssetRecordField.BUY_PRICE] },
  { id: 3324, location: [SectionType.C, 1, AssetRecordField.GAIN] },
  { id: 3325, location: [SectionType.C, 1, AssetRecordField.LOSS] },
  { id: 3330, location: [SectionType.C, 2, AssetRecordField.TOTAL] },
  { id: 3331, location: [SectionType.C, 2, AssetRecordField.ASSET] },
  { id: 3332, location: [SectionType.C, 2, AssetRecordField.SELL_PRICE] },
  { id: 3333, location: [SectionType.C, 2, AssetRecordField.BUY_PRICE] },
  { id: 3334, location: [SectionType.C, 2, AssetRecordField.GAIN] },
  { id: 3335, location: [SectionType.C, 2, AssetRecordField.LOSS] },
  { id: 3340, location: [SectionType.C, 3, AssetRecordField.TOTAL] },
  { id: 3341, location: [SectionType.C, 3, AssetRecordField.ASSET] },
  { id: 3342, location: [SectionType.C, 3, AssetRecordField.SELL_PRICE] },
  { id: 3343, location: [SectionType.C, 3, AssetRecordField.BUY_PRICE] },
  { id: 3344, location: [SectionType.C, 3, AssetRecordField.GAIN] },
  { id: 3345, location: [SectionType.C, 3, AssetRecordField.LOSS] },
  { id: 3350, location: [SectionType.C, 4, AssetRecordField.TOTAL] },
  { id: 3351, location: [SectionType.C, 4, AssetRecordField.ASSET] },
  { id: 3352, location: [SectionType.C, 4, AssetRecordField.SELL_PRICE] },
  { id: 3353, location: [SectionType.C, 4, AssetRecordField.BUY_PRICE] },
  { id: 3354, location: [SectionType.C, 4, AssetRecordField.GAIN] },
  { id: 3355, location: [SectionType.C, 4, AssetRecordField.LOSS] },
  { id: 3360, location: [SectionType.C, 5, AssetRecordField.TOTAL] },
  { id: 3361, location: [SectionType.C, 5, AssetRecordField.ASSET] },
  { id: 3362, location: [SectionType.C, 5, AssetRecordField.SELL_PRICE] },
  { id: 3363, location: [SectionType.C, 5, AssetRecordField.BUY_PRICE] },
  { id: 3364, location: [SectionType.C, 5, AssetRecordField.GAIN] },
  { id: 3365, location: [SectionType.C, 5, AssetRecordField.LOSS] },
  { id: 3370, location: [SectionType.C, 6, AssetRecordField.TOTAL] },
  { id: 3371, location: [SectionType.C, 6, AssetRecordField.ASSET] },
  { id: 3372, location: [SectionType.C, 6, AssetRecordField.SELL_PRICE] },
  { id: 3373, location: [SectionType.C, 6, AssetRecordField.BUY_PRICE] },
  { id: 3374, location: [SectionType.C, 6, AssetRecordField.GAIN] },
  { id: 3375, location: [SectionType.C, 6, AssetRecordField.LOSS] },
  { id: 3410, location: [SectionType.D, 0, AssetRecordField.TOTAL] },
  { id: 3411, location: [SectionType.D, 0, AssetRecordField.ASSET] },
  { id: 3412, location: [SectionType.D, 0, AssetRecordField.SELL_PRICE] },
  { id: 3413, location: [SectionType.D, 0, AssetRecordField.BUY_PRICE] },
  { id: 3414, location: [SectionType.D, 0, AssetRecordField.GAIN] },
  { id: 3415, location: [SectionType.D, 0, AssetRecordField.LOSS] },
  { id: 3420, location: [SectionType.D, 1, AssetRecordField.TOTAL] },
  { id: 3421, location: [SectionType.D, 1, AssetRecordField.ASSET] },
  { id: 3422, location: [SectionType.D, 1, AssetRecordField.SELL_PRICE] },
  { id: 3423, location: [SectionType.D, 1, AssetRecordField.BUY_PRICE] },
  { id: 3424, location: [SectionType.D, 1, AssetRecordField.GAIN] },
  { id: 3425, location: [SectionType.D, 1, AssetRecordField.LOSS] },
  { id: 3430, location: [SectionType.D, 2, AssetRecordField.TOTAL] },
  { id: 3431, location: [SectionType.D, 2, AssetRecordField.ASSET] },
  { id: 3432, location: [SectionType.D, 2, AssetRecordField.SELL_PRICE] },
  { id: 3433, location: [SectionType.D, 2, AssetRecordField.BUY_PRICE] },
  { id: 3434, location: [SectionType.D, 2, AssetRecordField.GAIN] },
  { id: 3435, location: [SectionType.D, 2, AssetRecordField.LOSS] },
  { id: 3440, location: [SectionType.D, 3, AssetRecordField.TOTAL] },
  { id: 3441, location: [SectionType.D, 3, AssetRecordField.ASSET] },
  { id: 3442, location: [SectionType.D, 3, AssetRecordField.SELL_PRICE] },
  { id: 3443, location: [SectionType.D, 3, AssetRecordField.BUY_PRICE] },
  { id: 3444, location: [SectionType.D, 3, AssetRecordField.GAIN] },
  { id: 3445, location: [SectionType.D, 3, AssetRecordField.LOSS] },
  { id: 3450, location: [SectionType.D, 4, AssetRecordField.TOTAL] },
  { id: 3451, location: [SectionType.D, 4, AssetRecordField.ASSET] },
  { id: 3452, location: [SectionType.D, 4, AssetRecordField.SELL_PRICE] },
  { id: 3453, location: [SectionType.D, 4, AssetRecordField.BUY_PRICE] },
  { id: 3454, location: [SectionType.D, 4, AssetRecordField.GAIN] },
  { id: 3455, location: [SectionType.D, 4, AssetRecordField.LOSS] },
  { id: 3460, location: [SectionType.D, 5, AssetRecordField.TOTAL] },
  { id: 3461, location: [SectionType.D, 5, AssetRecordField.ASSET] },
  { id: 3462, location: [SectionType.D, 5, AssetRecordField.SELL_PRICE] },
  { id: 3463, location: [SectionType.D, 5, AssetRecordField.BUY_PRICE] },
  { id: 3464, location: [SectionType.D, 5, AssetRecordField.GAIN] },
  { id: 3465, location: [SectionType.D, 5, AssetRecordField.LOSS] },
  { id: 3470, location: [SectionType.D, 6, AssetRecordField.TOTAL] },
  { id: 3471, location: [SectionType.D, 6, AssetRecordField.ASSET] },
  { id: 3472, location: [SectionType.D, 6, AssetRecordField.SELL_PRICE] },
  { id: 3473, location: [SectionType.D, 6, AssetRecordField.BUY_PRICE] },
  { id: 3474, location: [SectionType.D, 6, AssetRecordField.GAIN] },
  { id: 3475, location: [SectionType.D, 6, AssetRecordField.LOSS] },
];

export type SummaryFieldMapping = [SectionType, SectionSummaryField];

export interface SummaryFieldConfig {
  id: number;
  location: SummaryFieldMapping;
}

export const summaryFieldMap: SummaryFieldConfig[] = [
  { id: 3300, location: [SectionType.A, SectionSummaryField.TOTAL_SELL_PRICE] },
  { id: 3301, location: [SectionType.A, SectionSummaryField.TOTAL_BUY_PRICE] },
  { id: 3304, location: [SectionType.A, SectionSummaryField.TOTAL_GAIN] },
  { id: 3305, location: [SectionType.A, SectionSummaryField.TOTAL_LOSS] },
  { id: 3400, location: [SectionType.C, SectionSummaryField.TOTAL_SELL_PRICE] },
  { id: 3401, location: [SectionType.C, SectionSummaryField.TOTAL_BUY_PRICE] },
  { id: 3303, location: [SectionType.C, SectionSummaryField.TOTAL_GAIN] },
  { id: 3304, location: [SectionType.C, SectionSummaryField.TOTAL_LOSS] },
  { id: 3500, location: [SectionType.D, SectionSummaryField.TOTAL_SELL_PRICE] },
  { id: 3501, location: [SectionType.D, SectionSummaryField.TOTAL_BUY_PRICE] },
  { id: 3503, location: [SectionType.D, SectionSummaryField.TOTAL_GAIN] },
  { id: 3504, location: [SectionType.D, SectionSummaryField.TOTAL_LOSS] },
];

export interface ValidationError {
  field: string;
  message: string;
}

export interface SuccessfulValidation {
  isValid: true;
}

export interface FailedValidation {
  isValid: false;
  errors: ValidationError[];
}

export type ValidationResult = {
  isValid: boolean;
  errors: ValidationError[];
};

export interface K4Data {
  metaInfo: MetaInfo;
  personInfo: PersonInfo;
  recordMatrix: RecordMatrix;
  summaryMatrix: SectionSummaryMatrix;
  deferredShare: DeferredShare;
}
