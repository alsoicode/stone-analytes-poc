import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AnalyteFormComponent } from './analytes/components/analyte-form/analyte-form.component';
import { AnalytesService } from './analytes/services/analytes.service';
import { ComponentWithSubscriptionsDirective } from './lib/directives/component-with-subscriptions.directive';
import { ControlErrorContainerDirective } from './lib/form-errors/directives/control-error-container.directive';
import { ControlErrorsDirective } from './lib/form-errors/directives/control-errors.directive';
import { FormErrorComponent } from './lib/form-errors/components/form-error.component';

@NgModule({
  declarations: [
    AppComponent,
    AnalyteFormComponent,
    ComponentWithSubscriptionsDirective,
    ControlErrorContainerDirective,
    ControlErrorsDirective,
    FormErrorComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
    AnalytesService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
