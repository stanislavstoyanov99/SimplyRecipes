import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesSubmitRecipeComponent } from './recipes-submit-recipe.component';

describe('RecipesSubmitRecipeComponent', () => {
  let component: RecipesSubmitRecipeComponent;
  let fixture: ComponentFixture<RecipesSubmitRecipeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesSubmitRecipeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesSubmitRecipeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
