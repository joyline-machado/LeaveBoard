import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';

export const adminRoleManagerGuard: CanMatchFn = (route, segments) => {
  const role = localStorage.getItem('Role');
  if(role && role === 'ADMIN'){
    return true;
  }
  return false;
};
