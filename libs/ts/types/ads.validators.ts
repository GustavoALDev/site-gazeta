import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador para URL (mais permissivo que o padrão)
 */
export function urlValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      return null;
    }

    const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
    const isValid = urlPattern.test(control.value);

    return isValid ? null : { invalidUrl: { value: control.value } };
  };
}

/**
 * Validador para verificar se a data final é posterior à data inicial
 */
export function endDateAfterStartDateValidator(startDateControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || !control.parent) {
      return null;
    }

    const startDateControl = control.parent.get(startDateControlName);
    if (!startDateControl || !startDateControl.value) {
      return null;
    }

    const startDate = new Date(startDateControl.value);
    const endDate = new Date(control.value);

    if (endDate <= startDate) {
      return { endDateBeforeStart: true };
    }

    return null;
  };
}

/**
 * Validador para tipo de arquivo de imagem
 */
export function imageTypeValidator(allowedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;
    
    if (!file || typeof file === 'string') {
      return null;
    }

    const isValid = allowedTypes.includes(file.type);
    return isValid ? null : { invalidImageType: { allowedTypes } };
  };
}

/**
 * Validador para tamanho máximo de arquivo
 */
export function maxFileSizeValidator(maxSizeInBytes: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;
    
    if (!file || typeof file === 'string') {
      return null;
    }

    if (file.size > maxSizeInBytes) {
      return { 
        maxFileSize: { 
          maxSize: maxSizeInBytes,
          actualSize: file.size 
        } 
      };
    }

    return null;
  };
}

