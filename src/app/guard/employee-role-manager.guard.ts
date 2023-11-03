import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const employeeRoleManagerGuard: CanMatchFn = (route, segments) => {
  const role = localStorage.getItem('Role');
  if(role && role === 'EMPLOYEE'){
    return true;
  }
  return false;
};
