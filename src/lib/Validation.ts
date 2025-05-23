import Personnummer from 'personnummer';
import {
  ValidationResult,
  ValidationError,
  PersonInfoField,
  K4Data,
  SectionType,
  sectionConfigMap,
  AssetRecordField,
  SectionSummaryField,
  sectionSummaryFieldAssetFieldMap,
  MetaInfoField,
} from '@/models/K4';
import { translate } from './Localization';

export class Validation {
  static validate(data: K4Data): ValidationResult {
    const errors: ValidationError[] = [];

    const missingFieldErrors = Validation.getMissingFieldErrors(data);
    if (missingFieldErrors.length > 0) {
      errors.push(...missingFieldErrors);
    }

    const invalidFieldErrors = Validation.getInvalidFieldErrors(data);
    if (invalidFieldErrors.length > 0) {
      errors.push(...invalidFieldErrors);
    }

    const invalidSummaryErrors =
      Validation.getInconsistentSectionSummaryErrors(data);
    if (invalidSummaryErrors.length > 0) {
      errors.push(...invalidSummaryErrors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static getMissingFieldErrors(data: K4Data): ValidationError[] {
    const errors: ValidationError[] = [];

    Object.values(MetaInfoField).forEach(field => {
      if (!data.metaInfo[field]) {
        errors.push({
          field,
          message: translate(`missingFieldError.metaInfo.${field}`),
        });
      }
    });

    Object.values(PersonInfoField).forEach(field => {
      if (!data.personInfo[field]) {
        errors.push({
          field,
          message: translate(`missingFieldError.personInfo.${field}`),
        });
      }
    });

    for (let page = 0; page < data.pages.length; page++) {
      Object.values(SectionType).forEach(sectionType => {
        const sectionConfig = sectionConfigMap[sectionType];
        const numRecords = sectionConfig.numRecords;

        let hasData = false;
        let hasGain = false;
        let hasLoss = false;
        for (let i = 0; i < numRecords; i++) {
          if (Validation.sectionRowHasData(data, page, sectionType, i)) {
            hasData = true;

            const gainIsSet =
              data.pages[page].recordMatrix[sectionType][i][
                AssetRecordField.GAIN
              ] !== 0;

            if (gainIsSet) {
              hasGain = true;
            }

            const lossIsSet =
              data.pages[page].recordMatrix[sectionType][i][
                AssetRecordField.LOSS
              ] !== 0;

            if (lossIsSet) {
              hasLoss = true;
            }

            Object.keys(data.pages[page].recordMatrix[sectionType][i]).forEach(
              f => {
                const field = f as AssetRecordField;
                const fieldValue =
                  data.pages[page].recordMatrix[sectionType][i][field];
                if (
                  field === AssetRecordField.TOTAL ||
                  field === AssetRecordField.BUY_PRICE
                ) {
                  return;
                }
                if (!fieldValue) {
                  if (
                    (field === AssetRecordField.GAIN && lossIsSet) ||
                    (field === AssetRecordField.LOSS && gainIsSet)
                  ) {
                    return;
                  }
                  errors.push({
                    field: field as AssetRecordField,
                    message: translate(
                      `missingFieldError.${sectionType}.record.${field}`,
                    ),
                  });
                }
              },
            );
          }
        }

        if (hasData) {
          Object.values(SectionSummaryField).forEach(field => {
            if (
              (field === SectionSummaryField.TOTAL_GAIN && !hasGain) ||
              (field === SectionSummaryField.TOTAL_LOSS && !hasLoss)
            ) {
              return;
            }

            if (!data.pages[page].summaryMatrix[sectionType][field]) {
              errors.push({
                field: field as SectionSummaryField,
                message: translate(
                  `missingFieldError.${sectionType}.summary.${field}`,
                ),
              });
            }
          });
        }
      });
    }

    return errors;
  }

  static getInvalidFieldErrors(data: K4Data): ValidationError[] {
    const errors: ValidationError[] = [];

    if (data.metaInfo.year && !data.metaInfo.year.match(/^20[0-9]{2}$/)) {
      errors.push({
        field: MetaInfoField.YEAR,
        message: translate('field.validationError.metaInfo.year'),
      });
    }

    if (
      data.metaInfo.pageNumber &&
      !data.metaInfo.pageNumber.match(/^[0-9]{1,2}$/)
    ) {
      errors.push({
        field: MetaInfoField.PAGE_NUMBER,
        message: translate('field.validationError.metaInfo.pageNumber'),
      });
    }

    if (
      data.personInfo.personNumber &&
      !Validation.validatePersonNumber(data.personInfo.personNumber)
    ) {
      errors.push({
        field: PersonInfoField.PERSON_NUMBER,
        message: translate('field.validationError.personInfo.personNumber'),
      });
    }

    if (
      data.personInfo.postCode &&
      !data.personInfo.postCode.match(/^\d{3} ?\d{2}$/)
    ) {
      errors.push({
        field: PersonInfoField.POST_CODE,
        message: translate('field.validationError.personInfo.postCode'),
      });
    }

    return errors;
  }

  static validatePersonNumber(personNumber: string): boolean {
    return Personnummer.valid(personNumber);
  }

  static sectionRowHasData(
    data: K4Data,
    page: number,
    sectionType: SectionType,
    row: number,
  ): boolean {
    return Object.keys(data.pages[page].recordMatrix[sectionType][row]).some(
      field => {
        const fieldValue =
          data.pages[page].recordMatrix[sectionType][row][
            field as AssetRecordField
          ];
        return fieldValue !== 0 && fieldValue !== '';
      },
    );
  }

  static sectionSummaryIsRequired(
    data: K4Data,
    page: number,
    sectionType: SectionType,
  ): boolean {
    return [...new Array(sectionConfigMap[sectionType].numRecords)]
      .map((_, index) => index)
      .some(index =>
        Validation.sectionRowHasData(data, page, sectionType, index),
      );
  }

  static getSectionSummaryFieldSum(
    data: K4Data,
    page: number,
    sectionType: SectionType,
    field: AssetRecordField,
  ): number {
    if (field === AssetRecordField.ASSET) {
      return 0;
    }
    const sectionConfig = sectionConfigMap[sectionType];
    const numRecords = sectionConfig.numRecords;

    let sum = 0;

    for (let i = 0; i < numRecords; i++) {
      if (Validation.sectionRowHasData(data, page, sectionType, i)) {
        sum += data.pages[page].recordMatrix[sectionType][i][field];
      }
    }

    return sum;
  }

  static getInconsistentSectionSummaryErrors(data: K4Data): ValidationError[] {
    const errors: ValidationError[] = [];

    for (let page = 0; page < data.pages.length; page++) {
      Object.values(SectionType).forEach(sectionType => {
        if (Validation.sectionSummaryIsRequired(data, page, sectionType)) {
          Object.values(SectionSummaryField).forEach(field => {
            const sectionFieldSum = Validation.getSectionSummaryFieldSum(
              data,
              page,
              sectionType,
              Validation.getRecordFieldFromSummaryField(field),
            );

            if (
              sectionFieldSum !==
              data.pages[page].summaryMatrix[sectionType][field]
            ) {
              errors.push({
                field: sectionType,
                message: translate(
                  `inconsistentTotalError.${sectionType}.${field}`,
                ),
              });
            }
          });
        }
      });
    }
    return errors;
  }

  static getRecordFieldFromSummaryField(
    field: SectionSummaryField,
  ): AssetRecordField {
    const relation = sectionSummaryFieldAssetFieldMap.find(
      relation => relation.summaryField === field,
    );

    if (relation) {
      return relation.recordField;
    } else {
      throw new Error(`No record field found for summary field: ${field}`);
    }
  }

  static getSummaryFieldFromRecordField(
    field: AssetRecordField,
  ): SectionSummaryField {
    const relation = sectionSummaryFieldAssetFieldMap.find(
      relation => relation.recordField === field,
    );

    if (relation) {
      return relation.summaryField;
    } else {
      throw new Error(`No summary field found for record field: ${field}`);
    }
  }
}
