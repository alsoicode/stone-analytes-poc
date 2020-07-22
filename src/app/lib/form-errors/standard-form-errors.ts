import { InjectionToken } from '@angular/core';

export const defaultErrors = {
  invalid: 'This value is not allowed',
  pattern: 'This value is not allowed',
  required: 'Required',
};

export const STANDARD_FORM_ERRORS = new InjectionToken('STANDARD_FORM_ERRORS', {
  providedIn: 'root',
  factory: () => defaultErrors
});
