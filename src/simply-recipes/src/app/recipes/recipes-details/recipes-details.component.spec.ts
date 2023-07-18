import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesDetailsComponent } from './recipes-details.component';

describe('RecipesDetailsComponent', () => {
  let component: RecipesDetailsComponent;
  let fixture: ComponentFixture<RecipesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
