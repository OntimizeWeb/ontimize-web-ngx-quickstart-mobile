import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { OChartComponent } from 'ontimize-web-ngx-charts';
import { FilterExpressionUtils } from 'ontimize-web-ngx';

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

  @ViewChild('chart') chart: OChartComponent;
  today = new Date();

  onFormDataLoaded(data): void {
    let beKey = FilterExpressionUtils.buildExpressionEquals('ACCOUNTID', 1);
    let be1 = FilterExpressionUtils.buildExpressionMoreEqual('DATE_', new Date(2000, 6, 1).getTime());
    let be2 = FilterExpressionUtils.buildExpressionLessEqual('DATE_', new Date(2000, 7, 0).getTime());
    let beDates = FilterExpressionUtils.buildComplexExpression(be1, be2, FilterExpressionUtils.OP_AND);
    let be = FilterExpressionUtils.buildBasicExpression(FilterExpressionUtils.buildComplexExpression(beKey, beDates, FilterExpressionUtils.OP_AND));
    this.chart.queryData(be);
  }

}
