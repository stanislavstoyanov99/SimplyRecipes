import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllFaqsComponent } from './get-all-faqs.component';

describe('GetAllFaqsComponent', () => {
  let component: GetAllFaqsComponent;
  let fixture: ComponentFixture<GetAllFaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllFaqsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
