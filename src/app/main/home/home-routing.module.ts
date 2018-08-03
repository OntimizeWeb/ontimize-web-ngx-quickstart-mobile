import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AccountDetailComponent } from './account-detail/account-detail.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: ':ACCOUNTID', component: AccountDetailComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
