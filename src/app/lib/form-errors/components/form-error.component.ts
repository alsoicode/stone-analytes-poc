import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p class="text-danger my-2" [ngClass]="{ 'd-none': _hidden }">{{ _text }}</p>
  `,
})
export class FormErrorComponent {
  _text;
  _hidden = true;

  @Input() set text(value) {
    if (value !== this._text) {
      this._text = value;
      this._hidden = !value;

      this.changeDetectorRef.detectChanges();
    }
  };

  constructor(
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

}
