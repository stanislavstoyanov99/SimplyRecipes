import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFaqComponent } from './create-faq.component';

describe('CreateFaqComponent', () => {
  let component: CreateFaqComponent;
  let fixture: ComponentFixture<CreateFaqComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateFaqComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateFaqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
