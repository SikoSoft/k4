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

    let validationResult: ValidationResult = {
      isValid: true,
      errors: [],
    };

    const missingFieldErrors = Validation.getMissingFieldErrors(data);
    if (missingFieldErrors.length > 0) {
      validationResult.isValid = false;
      validationResult.errors.push(...missingFieldErrors);
    }

    /*
        if (!this.allFieldsUseCorrectFormat()) {
          validationResult.isValid = false;
        }
    
        if (!this.allRequiredFieldsAreFilled()) {
          validationResult.isValid = false;
        }
          */

    return validationResult;
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
}
