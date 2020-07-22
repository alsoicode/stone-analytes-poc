import { FormGroup } from '@angular/forms';

import { IAnalyte } from './interfaces';

export const sumAnalytes = (formGroup: FormGroup): number => {
  const analytesValues: number[] = (formGroup.value.analytes as IAnalyte[]).filter(analyte => Boolean(analyte.percentage)).map(analyte => Number(analyte.percentage));
  const customAnalytesValues: number[] = (formGroup.value.customAnalytes as IAnalyte[]).filter(analyte => Boolean(analyte.percentage)).map(analyte => Number(analyte.percentage));

  return [...analytesValues, ...customAnalytesValues].reduce((a: number, b: number) => a + b, 0);
};
