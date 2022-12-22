import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ByCategoryComponent } from './by-category.component';

describe('ByCategoryComponent', () => {
  let component: ByCategoryComponent;
  let fixture: ComponentFixture<ByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ByCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
