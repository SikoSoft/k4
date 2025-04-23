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

    Object.values(SectionType).forEach(sectionType => {
      const sectionConfig = sectionConfigMap[sectionType];
      const numRecords = sectionConfig.numRecords;

      for (let i = 0; i < numRecords; i++) {
        if (Validation.sectionRowHasData(data, sectionType, i)) {
          const gainIsSet =
            data.recordMatrix[sectionType][i][AssetRecordField.GAIN] !== 0;

          const lossIsSet =
            data.recordMatrix[sectionType][i][AssetRecordField.LOSS] !== 0;

          Object.keys(data.recordMatrix[sectionType][i]).forEach(f => {
            const field = f as AssetRecordField;
            const fieldValue = data.recordMatrix[sectionType][i][field];
            if (field === AssetRecordField.TOTAL) {
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
          });
        }
      }
    });

    return errors;
  }

  static validatePersonNumber(personNumber: string): boolean {
    return Personnummer.valid(personNumber);
  }

  static sectionRowHasData(
    data: K4Data,
    sectionType: SectionType,
    row: number,
  ): boolean {
    return Object.keys(data.recordMatrix[sectionType][row]).some(field => {
      const fieldValue =
        data.recordMatrix[sectionType][row][field as AssetRecordField];
      return fieldValue !== 0 && fieldValue !== '';
    });
  }

  static sectionSummaryIsRequired(
    data: K4Data,
    sectionType: SectionType,
  ): boolean {
    return [...new Array(sectionConfigMap[sectionType].numRecords)]
      .map((_, index) => index)
      .some(index => Validation.sectionRowHasData(data, sectionType, index));
  }

  static getSectionSummaryFieldSum(
    data: K4Data,
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
      if (Validation.sectionRowHasData(data, sectionType, i)) {
        sum += data.recordMatrix[sectionType][i][field];
      }
    }

    return sum;
  }

  static getInconsistentSectionSummaryErrors(data: K4Data): ValidationError[] {
    const errors: ValidationError[] = [];
    Object.values(SectionType).forEach(sectionType => {
      if (Validation.sectionSummaryIsRequired(data, sectionType)) {
        Object.values(SectionSummaryField).forEach(field => {
          const sectionFieldSum = Validation.getSectionSummaryFieldSum(
            data,
            sectionType,
            Validation.getRecordFieldFromSummaryField(field),
          );

          if (sectionFieldSum !== data.summaryMatrix[sectionType][field]) {
            errors.push({
              field: sectionType,
              message: translate(`inconsistentTotalError.${sectionType}.`),
            });
          }
        });
      }
    });
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
