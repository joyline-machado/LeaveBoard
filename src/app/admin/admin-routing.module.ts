import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { UserComponent } from './user/user.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HolidaysComponent } from './holidays/holidays.component';
import { LeaveRequestComponent } from './leave-request/leave-request.component';
import { LeavesReq2Component } from './leaves-req2/leaves-req2.component';

const routes: Routes = [
  { path: '' , component: AdminComponent, children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full'},
    { path: 'dashboard', component: DashboardComponent},
    { path: 'user', component: UserComponent},
    {path: 'holidays', component: HolidaysComponent},
    {path: 'leave-request', component: LeaveRequestComponent},
    {path: 'leave-req', component: LeavesReq2Component}

  ]},
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
