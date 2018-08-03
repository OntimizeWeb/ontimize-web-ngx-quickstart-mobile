import { Component, OnInit } from '@angular/core';
import { OUserInfoService } from 'ontimize-web-ngx';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  host: {
    '[class.home-component]': 'true'
  }
})
export class HomeComponent implements OnInit {

  public username: string;

  constructor(
    private userService: OUserInfoService
  ) { }

  ngOnInit() {
    let userInfo = this.userService.getUserInfo();
    if (userInfo) {
      this.username = userInfo.username;
    }
  }

  calculateUserBalance(data: any[]): number {
    return data.map(a => a.BALANCE).reduce((a, b) => a + b, 0);
  }

}
