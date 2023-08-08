import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipesService } from 'src/app/services/recipes.service';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ICategoryList } from 'src/app/shared/interfaces/categories/category-list';

@Component({
  selector: 'app-submit-recipe',
  templateUrl: './submit-recipe.component.html',
  styleUrls: ['./submit-recipe.component.scss']
})
export class SubmitRecipeComponent implements OnInit {

  difficulties: string[] = ['Difficult', 'Medium', 'Easy'];
  categories: ICategoryList[] = [];

  formGroup: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;

  get formArray(): AbstractControl { return this.formGroup.get('formArray')!; }
  get mainFormGroup(): AbstractControl { return this.formArray.get([0])!; }
  get extraFormGroup(): AbstractControl { return this.formArray.get([1])!; }
  
  constructor(
    private formBuilder: FormBuilder,
    private breakpointObserver: BreakpointObserver,
    private recipesService: RecipesService,
    private dialog: MatDialog) {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          name: ['', Validators.required],
          description: ['', Validators.required],
          ingredients: ['', Validators.required],
          preparationTime: [0],
          cookingTime: [0],
          portionsNumber: [0]
        }),
        this.formBuilder.group({
          difficulty: [null, Validators.required],
          category: [null, Validators.required]
        }),
      ])
    });
  }

  ngOnInit(): void {
    this.recipesService.getRecipesCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
      }
    });
  }

}
