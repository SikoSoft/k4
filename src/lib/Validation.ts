import Personnummer from 'personnummer';
import {
  ValidationResult,
  ValidationError,
  PersonInfoField,
  K4Data,
  SectionType,
  sectionConfigMap,
  AssetRecordField,
} from '@/models/K4';
import { translate } from './Localization';

export class Validation {
  static validate(data: K4Data): ValidationResult {
    console.log('validate');

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

    /*
        if (!this.allFieldsUseCorrectFormat()) {
          validationResult.isValid = false;
        }
    
        if (!this.allRequiredFieldsAreFilled()) {
          validationResult.isValid = false;
        }
          */

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static getMissingFieldErrors(data: K4Data): ValidationError[] {
    const errors: ValidationError[] = [];

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
                message: translate(`missingFieldError.${sectionType}.${field}`),
              });
            }
          });
        }
      }
    });

    return errors;
  }

  allRequiredFieldsAreFilled(): boolean {
    return false;
  }

  allFieldsUseCorrectFormat(): boolean {
    return false;
  }

  static validatePersonNumber(personNumber: string): boolean {
    return Personnummer.valid(personNumber);
  }

  /*
  static sectionRowFieldIsRequired(
    data: K4Data,
    sectionType: SectionType,
    field: string,
    row: number,
  ): boolean {
    
  }
  */

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
}
