import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllCategoriesComponent } from './get-all-categories.component';

describe('GetAllCategoriesComponent', () => {
  let component: GetAllCategoriesComponent;
  let fixture: ComponentFixture<GetAllCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllCategoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
