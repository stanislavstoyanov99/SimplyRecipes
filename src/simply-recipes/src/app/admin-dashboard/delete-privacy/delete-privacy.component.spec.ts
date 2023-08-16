import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePrivacyComponent } from './delete-privacy.component';

describe('DeletePrivacyComponent', () => {
  let component: DeletePrivacyComponent;
  let fixture: ComponentFixture<DeletePrivacyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletePrivacyComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePrivacyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
