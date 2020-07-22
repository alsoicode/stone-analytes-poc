import { asyncScheduler } from 'rxjs';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ValidationErrors } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { AnalytesService } from '../../services/analytes.service';
import { analytesSumValidator } from '../../validators/analytes-sum.validator';
import { customAnalyteValidator } from './../../validators/custom-analyte.validator';
import { ComponentWithSubscriptionsDirective } from '@app/lib/directives/component-with-subscriptions.directive';
import { IAnalyte } from '../../interfaces';
import { regexPatterns } from '../../regex-patterns';
import { sumAnalytes } from '../../utils';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  selector: 'app-analyte-form',
  styleUrls: [
    './analyte-form.component.scss',
  ],
  templateUrl: './analyte-form.component.html',
})
export class AnalyteFormComponent extends ComponentWithSubscriptionsDirective implements OnInit {

  analytesForm: FormGroup;
  defaultAnalytes: IAnalyte[];
  customErrors: ValidationErrors = {
    pattern: 'Invalid'
  };
  searchAnalyteIndexes: number[] = [];
  searchForm: FormGroup;
  showSearch = false;

  get analytesFormArray(): FormArray {
    return this.analytesForm.get('analytes') as FormArray;
  }

  get customAnalytesFormArray(): FormArray {
    return this.analytesForm.get('customAnalytes') as FormArray;
  }

  get sum(): number {
    return sumAnalytes(this.analytesForm);
  }

  constructor(
    private readonly analytesService: AnalytesService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly formBuilder: FormBuilder,
    private readonly renderer2: Renderer2,
  ) {
    super();
  }

  ngOnInit(): void {
    this.analytesService.getDefaultAnalytes().pipe(takeUntil(this.unsubscribe$)).subscribe(defaultAnalytes => {
      this.defaultAnalytes = defaultAnalytes;

      if (this.defaultAnalytes) {
        this.initForm();

        this.searchForm = this.formBuilder.group({
          name: ['']
        });

        this.searchForm.valueChanges.pipe(takeUntil(this.unsubscribe$)).subscribe((value: { name: string }) => {
          if (value.name.length >= 3) {
            this.searchAnalyteIndexes = this.defaultAnalytes.map((analyte: IAnalyte, index: number) => {
              if (analyte.name.toLocaleLowerCase().includes(value.name.toLocaleLowerCase())) {
                return index;
              }
            });
          }
        });
      }

      this.changeDetectorRef.markForCheck();
    });
  }

  initForm(): void {
    this.analytesForm = this.formBuilder.group({
      analytes: this.formBuilder.array([]),
      customAnalytes: this.formBuilder.array([]),
    }, {
      validators: analytesSumValidator(),
    });

    this.defaultAnalytes.forEach(analyte => this.addDefaultAnalyte(analyte));
    this.addCustomAnalyte();
    this.focusElement('#default-0 .form-control--percent:first-of-type');
  }

  addDefaultAnalyte(analyte?: IAnalyte): void {
    this.analytesFormArray.push(this.initAnalyteForm(analyte));
  }

  addCustomAnalyte(analyte?: IAnalyte): void {
    this.customAnalytesFormArray.push(this.initAnalyteForm(analyte, true));
  }

  initAnalyteForm(analyte: IAnalyte, isCustom = false): FormGroup {
    return this.formBuilder.group({
      name: [
        analyte ? analyte.name : null
      ],
      percentage: [
        analyte ? analyte.percentage : null, [
          Validators.pattern(regexPatterns.nonNegativeDecimal),
        ]
      ]
    }, {
      validators: isCustom ? [ customAnalyteValidator() ] : []
    });
  }

  removeCustomAnalyte(index: number): void {
    this.customAnalytesFormArray.removeAt(index);

    // if removing last/only item, add a new formgroup back so there is always 1
    if (this.customAnalytesFormArray.controls.length === 0) {
      this.addCustomAnalyte();
    }
  }

  onCustomAnalyteEnter(formGroup: FormGroup): void {
    if (formGroup.valid) {
      // only add a new custom group if there is not an existing pristine form
      const formArray = this.analytesForm.get('customAnalytes') as FormArray;
      const pristineCustomAnalyteFormGroup = formArray.controls.filter(fg => fg.pristine).length === 1;

      if (!pristineCustomAnalyteFormGroup) {
        this.addCustomAnalyte();

        this.focusElement(`#custom-${ formArray.controls.length - 1 } .form-control--name:last-of-type`);
      }
    }
  }

  focusElement(selector: string, delay = 0): void {
    asyncScheduler.schedule(() => {
      const element = this.renderer2.selectRootElement(selector);

      if (element) {
        element.focus();
      }
    }, delay);
  }

  searchIndexFound(index: number): boolean {
    if (this.searchAnalyteIndexes.length === 0) {
      return true;
    }
    else {
      return this.searchAnalyteIndexes.includes(index);
    }
  }

  toggleSearch(): void {
    this.showSearch = !this.showSearch;

    if (this.showSearch) {
      this.focusElement('#search-analytes');
    }
  }

}
