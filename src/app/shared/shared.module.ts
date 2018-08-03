import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OntimizeWebModule } from 'ontimize-web-ngx';
import { OChartModule } from 'ontimize-web-ngx-charts';

@NgModule({
  imports: [
    OChartModule,
    OntimizeWebModule
  ],
  declarations: [],
  exports: [
    CommonModule,
    OChartModule
  ]
})
export class SharedModule { }
