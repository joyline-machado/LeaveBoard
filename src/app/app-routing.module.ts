import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { authGuard } from './guard/auth.guard';
import { employeeRoleManagerGuard } from './guard/employee-role-manager.guard';
import { adminRoleManagerGuard } from './guard/admin-role-manager.guard';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  { 
    path: '', canActivate: [authGuard], canMatch: [employeeRoleManagerGuard],loadChildren: () => import('./employee/employee.module').then((mod) => mod.EmployeeModule)
  },
  { 
    path: '', canActivate: [authGuard],canMatch: [adminRoleManagerGuard],loadChildren: ()=> import('./admin/admin.module').then((mod) => mod.AdminModule)
  },
  { path: '', redirectTo: 'login',pathMatch: 'full' },
  { 
    path: 'login',component: LoginComponent
  },
  {
    path: '**', component: NotFoundComponent
  }
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
