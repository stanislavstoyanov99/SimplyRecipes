import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipesService } from 'src/app/services/recipes.service';
import { ErrorDialogComponent } from 'src/app/shared/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ICategoryList } from 'src/app/shared/interfaces/categories/category-list';
import { Router } from '@angular/router';
import { IRecipeCreate } from 'src/app/shared/interfaces/recipes/recipe-create';
import { NgxSpinnerService } from 'ngx-spinner';

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
    private dialog: MatDialog,
    private router: Router) {
    this.stepperOrientation = this.breakpointObserver
      .observe('(min-width: 800px)')
      .pipe(map(({matches}) => (matches ? 'horizontal' : 'vertical')));
    
    this.formGroup = this.formBuilder.group({
      formArray: this.formBuilder.array([
        this.formBuilder.group({
          name: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
          description: ['', [Validators.required, Validators.maxLength(20000), Validators.minLength(50)]],
          ingredients: ['', [Validators.required, Validators.maxLength(20000), Validators.minLength(10)]],
          preparationTime: [0, [Validators.max(180), Validators.min(0)]],
          cookingTime: [0, [Validators.max(180), Validators.min(0)]],
          portionsNumber: [0, [Validators.max(12), Validators.min(0)]]
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

  submitRecipeHandler(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }
    const { cookingTime, description, ingredients, name, portionsNumber, preparationTime } = formGroup.value['formArray'][0];
    const { category, difficulty } = formGroup.value['formArray'][1];
    const recipeCreateInputModel: IRecipeCreate = {
      name: name,
      description: description,
      ingredients: ingredients,
      preparationTime: preparationTime,
      cookingTime: cookingTime,
      portionsNumber: portionsNumber,
      difficulty: difficulty,
      categoryId: category,
      imagePath: ''
    };

    this.recipesService.submitRecipe(recipeCreateInputModel).subscribe({
      next: (recipe) => {
        this.router.navigate([`/recipes/details/${recipe.id}`]);
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
