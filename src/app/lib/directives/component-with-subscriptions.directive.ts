import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive({
  selector: '[appWithSubscriptions]',
})
export class ComponentWithSubscriptionsDirective implements OnDestroy {
  unsubscribe$ = new Subject();

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
