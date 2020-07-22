import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { IAnalyte } from '../interfaces';

@Injectable()
export class AnalytesService {

  getDefaultAnalytes(): Observable<IAnalyte[]> {
    const defaultAnalytes: IAnalyte[] = [];

    for (let i = 1; i < 81; i++) {
      defaultAnalytes.push({
        name: `Default Analyte ${ i }`
      });
    }

    return of(defaultAnalytes);
  }

}
