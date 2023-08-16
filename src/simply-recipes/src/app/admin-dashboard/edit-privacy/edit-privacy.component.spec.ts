import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPrivacyComponent } from './edit-privacy.component';

describe('EditPrivacyComponent', () => {
  let component: EditPrivacyComponent;
  let fixture: ComponentFixture<EditPrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
