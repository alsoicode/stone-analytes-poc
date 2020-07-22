import {
  ChangeDetectorRef,
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  ViewContainerRef,
} from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AbstractControl, NgControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ValidationErrors } from '@angular/forms';

import { STANDARD_FORM_ERRORS } from '../standard-form-errors';
import { FormErrorComponent } from '../components/form-error.component';
import { ControlErrorContainerDirective } from './control-error-container.directive';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[formControl], [formControlName]'
})
export class ControlErrorsDirective implements OnInit, OnDestroy {

  @Input()
  customErrors: ValidationErrors = {};

  @Input()
  changeDetectorRef: ChangeDetectorRef;

  viewContainerRef: ViewContainerRef;
  componentRef: ComponentRef<FormErrorComponent>;
  submit$: Observable<Event>;

  get control(): AbstractControl {
    return this.controlDir.control;
  }

  constructor(
    @Inject(DOCUMENT)
    private readonly document: Document,

    @Inject(STANDARD_FORM_ERRORS)
    private readonly errors,

    @Optional()
    controlErrorContainer: ControlErrorContainerDirective,

    private readonly vcr: ViewContainerRef,
    private readonly resolver: ComponentFactoryResolver,
    private readonly controlDir: NgControl
  ) {
    this.viewContainerRef = controlErrorContainer ? controlErrorContainer.viewContainerRef : this.vcr;
  }

  ngOnInit(): void {
    this.control.statusChanges.pipe(
      untilDestroyed(this),
    )
    .subscribe(() => {
      const controlErrors = this.control.errors;

      if (controlErrors) {
        const firstKey = Object.keys(controlErrors)[0];
        const text = this.customErrors[firstKey] || this.errors[firstKey];

        this.setError(text);
      }
      else {
        this.setError(null);
      }
    });
  }

  setError(text: string): void {
    if (isPlatformBrowser) {
      const label: HTMLLabelElement = this.document.querySelector(`label[for="${ this.viewContainerRef.element.nativeElement.id }"]`);

      if (label) {
        text ? label.classList.add('text-danger') : label.classList.remove('text-danger');
      }
    }

    if (!this.componentRef) {
      const factory = this.resolver.resolveComponentFactory(FormErrorComponent);
      this.componentRef = this.viewContainerRef.createComponent(factory);
    }

    this.componentRef.instance.text = text;

    if (this.changeDetectorRef) {
      this.changeDetectorRef.markForCheck();
    }
  }

  ngOnDestroy(): void {
    // required by ngx-take-until-destroy
  }

}
