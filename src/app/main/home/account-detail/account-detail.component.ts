import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { OChartComponent } from 'ontimize-web-ngx-charts';
import { FilterExpressionUtils, OFormComponent, OListComponent } from 'ontimize-web-ngx';

@Component({
  selector: 'account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
  host: {
    '[class.account-detail]': 'true'
  },
  encapsulation: ViewEncapsulation.None
})
export class AccountDetailComponent {

  @ViewChild('form') form: OFormComponent;
  @ViewChild('chart') chart: OChartComponent;
  @ViewChild('list') list: OListComponent;
  today = new Date();
  date = new Date(2000, 5);
  currentMonth: number = + new Date(2000, 5).getMonth();

  queryChart(): void {
    let fe1 = FilterExpressionUtils.buildExpressionMoreEqual('DATE_', new Date(this.date.getFullYear(), this.date.getMonth(), 1).getTime());
    let fe2 = FilterExpressionUtils.buildExpressionLess('DATE_', new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getTime());
    let beDates = FilterExpressionUtils.buildBasicExpression(FilterExpressionUtils.buildComplexExpression(fe1, fe2, FilterExpressionUtils.OP_AND));

    this.chart.queryData(Object.assign(beDates, this.form.getKeysValues()), { sqltypes: { DATE_: 93 } });
    this.list.queryData(beDates, { sqltypes: { DATE_: 93 } });
  }

  onClickPrevMonth(): void {
    this.date.setMonth(this.currentMonth - 1);
    this.currentMonth = this.date.getMonth();
    this.queryChart();
  }

  onClickNextMonth(): void {
    this.date.setMonth(this.currentMonth + 1);
    this.currentMonth = this.date.getMonth();
    this.queryChart();
  }

}
