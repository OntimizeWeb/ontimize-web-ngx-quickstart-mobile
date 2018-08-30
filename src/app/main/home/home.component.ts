import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[class.home-component]': 'true'
  },
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent {

  calculateUserBalance(data: any[]): number {
    return data.map(a => a.BALANCE).reduce((a, b) => a + b, 0);
  }

}
