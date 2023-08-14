import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipeEditDialogComponent } from './recipe-edit-dialog.component';

describe('RecipeEditDialogComponent', () => {
  let component: RecipeEditDialogComponent;
  let fixture: ComponentFixture<RecipeEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipeEditDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipeEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
