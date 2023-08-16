import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePrivacyComponent } from './create-privacy.component';

describe('CreatePrivacyComponent', () => {
  let component: CreatePrivacyComponent;
  let fixture: ComponentFixture<CreatePrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
