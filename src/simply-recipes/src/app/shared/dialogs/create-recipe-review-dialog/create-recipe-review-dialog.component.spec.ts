import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateRecipeReviewDialogComponent } from './create-recipe-review-dialog.component';

describe('CreateRecipeReviewDialogComponent', () => {
  let component: CreateRecipeReviewDialogComponent;
  let fixture: ComponentFixture<CreateRecipeReviewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateRecipeReviewDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateRecipeReviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
