import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminDashboardNavigationComponent } from './admin-dashboard-navigation.component';

describe('AdminDashboardNavigationComponent', () => {
  let component: AdminDashboardNavigationComponent;
  let fixture: ComponentFixture<AdminDashboardNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminDashboardNavigationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminDashboardNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
