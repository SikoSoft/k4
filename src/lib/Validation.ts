import Personnummer from 'personnummer';
import {
  ValidationResult,
  ValidationError,
  PersonInfoField,
  K4Data,
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
}
