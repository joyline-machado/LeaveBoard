import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { employeeRoleManagerGuard } from './employee-role-manager.guard';

describe('employeeRoleManagerGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => employeeRoleManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
