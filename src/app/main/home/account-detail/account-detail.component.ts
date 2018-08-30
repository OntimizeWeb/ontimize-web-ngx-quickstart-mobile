import { AfterViewInit, Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { Location } from '@angular/common';
import { OChartComponent, ChartDataAdapter } from 'ontimize-web-ngx-charts';
import { Codes, FilterExpressionUtils, OFormComponent, OListComponent, OntimizeEEService } from 'ontimize-web-ngx';
declare var d3: any;

@Component({
  selector: 'account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
  host: {
    '[class.account-detail]': 'true'
  },
  providers: [OntimizeEEService],
  encapsulation: ViewEncapsulation.None
})
export class AccountDetailComponent implements AfterViewInit {

  @ViewChild('form') form: OFormComponent;
  @ViewChild('chart') chart: OChartComponent;
  @ViewChild('list') list: OListComponent;
  today = new Date();
  date = new Date(2000, 5, 1);
  currentMonth: number = + new Date(2000, 5, 1).getMonth();

  constructor(
    protected service: OntimizeEEService,
    public location: Location
  ) { }

  ngAfterViewInit(): void {
    this.chart.options.chart['showLegend'] = false;
    this.chart.options.chart.xAxis.axisLabel = '';
    this.chart.options.chart.yAxis.axisLabel = '';
    this.chart.options.chart.yAxis.tickFormat = (d) => {
      let format = d3.format(',d');
      return format(d) + ' €';
    };
    this.chart.options.chart['color'] = ['#42a5f5'];
    this.chart.options.chart.lines = { isArea: true }
    // this.chart.options.chart.forceY = [0];
  }

  queryData(): void {
    this.chart.data = [];
    let feKey = FilterExpressionUtils.buildExpressionFromObject(this.form.getKeysValues());
    let fe1 = FilterExpressionUtils.buildExpressionMoreEqual('DATE_', new Date(this.date.getFullYear(), this.date.getMonth(), 1).getTime());
    let fe2 = FilterExpressionUtils.buildExpressionLess('DATE_', new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getTime());
    let beDates = FilterExpressionUtils.buildComplexExpression(fe1, fe2, FilterExpressionUtils.OP_AND);

    let self = this;
    let beMonthEnd = FilterExpressionUtils.buildBasicExpression(FilterExpressionUtils.buildComplexExpression(feKey, fe2, FilterExpressionUtils.OP_AND));
    this.service.configureService(this.service.getDefaultServiceConfiguration('movements'));
    this.service.query(beMonthEnd, ['MOVEMENT', 'DATE_'], 'movement', { DATE_: 93 }).subscribe(res => {
      if (res && res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE && res.data.length > 0) {
        let balance = res.data.map(a => a.MOVEMENT).reduce((a, b) => a + b);
        let balanceProgress = [{ BALANCE: balance, DATE: new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getTime() }];
        let beCurrentMonth = FilterExpressionUtils.buildBasicExpression(FilterExpressionUtils.buildComplexExpression(feKey, beDates, FilterExpressionUtils.OP_AND));
        self.service.query(beCurrentMonth, ['MOVEMENT', 'DATE_'], 'movement', { DATE_: 93 }).subscribe(res => {
          if (res && res.code === Codes.ONTIMIZE_SUCCESSFUL_CODE && res.data.length > 0) {
            balanceProgress.unshift(...res.data.slice().reverse().map(elem => {
              return { BALANCE: (balance -= elem.MOVEMENT), DATE: elem.DATE_ };
            }).reverse());
            balanceProgress.unshift({ BALANCE: balance, DATE: new Date(this.date.getFullYear(), this.date.getMonth(), 1).getTime() });
            let factory = self.chart.getChartDataAdapterFactory();
            let adapter: ChartDataAdapter = factory.getAdapter('line');
            let adaptedResult = adapter.adaptResult(balanceProgress);
            self.chart.data = adaptedResult;
          }
        }, err => {
          console.log(err);
        });
      }
    }, err => {
      console.log(err);
    });

    let beList = FilterExpressionUtils.buildBasicExpression(FilterExpressionUtils.buildComplexExpression(feKey, beDates, FilterExpressionUtils.OP_AND));
    this.list.queryData(beList, { sqltypes: { DATE_: 93 } });
  }

  onClickPrevMonth(): void {
    this.currentMonth = this.getPrevMonth(this.currentMonth);
    this.date.setMonth(this.currentMonth);
    if (this.currentMonth === 11) {
      this.date.setFullYear(this.date.getFullYear() - 1);
    }
    this.queryData();
  }

  onClickNextMonth(): void {
    this.currentMonth = this.getNextMonth(this.currentMonth);
    this.date.setMonth(this.currentMonth);
    if (this.currentMonth === 0) {
      this.date.setFullYear(this.date.getFullYear() + 1);
    }
    this.queryData();
  }

  getPrevMonth(month): number {
    let date = new Date();
    date.setDate(1);
    date.setMonth(month - 1);
    return date.getMonth();
  }

  getNextMonth(month): number {
    let date = new Date();
    date.setDate(1);
    date.setMonth(month + 1);
    return date.getMonth();
  }

}
