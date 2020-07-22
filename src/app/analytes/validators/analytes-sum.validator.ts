import { FormGroup } from '@angular/forms';

import { sumAnalytes } from '../utils';

export const analytesSumValidator = () => {
  return (formGroup: FormGroup) => {
    const sum = sumAnalytes(formGroup);

    formGroup.setErrors(null);

    if (sum < 99) {
      formGroup.setErrors({ rangeNotMet: true });

      return formGroup;
    }
    else if (sum > 101) {
      formGroup.setErrors({ rangeExceeded: true });

      return formGroup;
    }

    return null;
  };
};
