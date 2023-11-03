import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavesReq2Component } from './leaves-req2.component';

describe('LeavesReq2Component', () => {
  let component: LeavesReq2Component;
  let fixture: ComponentFixture<LeavesReq2Component>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LeavesReq2Component]
    });
    fixture = TestBed.createComponent(LeavesReq2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
