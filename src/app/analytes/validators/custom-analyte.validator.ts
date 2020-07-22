import { FormControl, FormGroup } from '@angular/forms';

export const customAnalyteValidator = () => {
  return (formGroup: FormGroup) => {
    const name = formGroup.get('name') as FormControl;
    const percentage = formGroup.get('percentage') as FormControl;

    name.setErrors(null);
    percentage.setErrors(null);

    if (name.value && percentage.value) {
      return null;
    }
    else if (name.value && !percentage.value) {
      return percentage.setErrors({ required: true });
    }
    else if (!name.value && percentage.value) {
      return name.setErrors({ required: true });
    }
  };
};
