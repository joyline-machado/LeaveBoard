import { TestBed } from '@angular/core/testing';
import { CanMatchFn } from '@angular/router';

import { adminRoleManagerGuard } from './admin-role-manager.guard';

describe('adminRoleManagerGuard', () => {
  const executeGuard: CanMatchFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => adminRoleManagerGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
