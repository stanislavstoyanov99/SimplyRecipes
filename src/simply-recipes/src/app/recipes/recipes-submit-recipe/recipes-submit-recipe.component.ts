import { Component, OnInit } from '@angular/core';
import { Observable, map } from 'rxjs';
import { StepperOrientation } from '@angular/material/stepper';
import { BreakpointObserver } from '@angular/cdk/layout';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RecipesService } from 'src/app/services/recipes.service';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ICategoryList } from 'src/app/shared/interfaces/categories/category-list';
import { Router } from '@angular/router';
import { FileTypeValidatorDirective } from 'src/app/shared/custom-validators/file-type-validator.directive';
import { Difficulty } from 'src/app/shared/enums/difficulty';

@Component({
  selector: 'app-recipes-submit-recipe',
  templateUrl: './recipes-submit-recipe.component.html',
  styleUrls: ['./recipes-submit-recipe.component.scss']
})
export class RecipesSubmitRecipeComponent implements OnInit {

  difficulties: string[] = Object.keys(Difficulty).filter((key) => Number.isNaN(parseInt(key, 10)));
  categories: ICategoryList[] = [];

  formGroup: FormGroup;
  stepperOrientation: Observable<StepperOrientation>;
  isSuccessfullyCreated: boolean = false;

  get formArray(): AbstractControl { return this.formGroup.get('formArray')!; }
  get mainFormGroup(): AbstractControl { return this.formArray.get([0])!; }
  get extraFormGroup(): AbstractControl { return this.formArray.get([1])!; }

  imageName: string = '';
  image!: File;
  
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
          image: [null, [FileTypeValidatorDirective.validate]],
          imageName: ['Choose Image'],
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
    const recipeCreateInputModel = new FormData();
    recipeCreateInputModel.append('name', name);
    recipeCreateInputModel.append('description', description);
    recipeCreateInputModel.append('ingredients', ingredients);
    recipeCreateInputModel.append('preparationTime', preparationTime);
    recipeCreateInputModel.append('cookingTime', cookingTime);
    recipeCreateInputModel.append('portionsNumber', portionsNumber);
    recipeCreateInputModel.append('difficulty', difficulty);
    recipeCreateInputModel.append('categoryId', category);
    recipeCreateInputModel.append('image', this.image);

    this.recipesService.submitRecipe(recipeCreateInputModel).subscribe({
      next: (recipe) => {
        this.isSuccessfullyCreated = true;
        setTimeout(() => {
          this.router.navigate([`/recipes/details/${recipe.id}`]);
        }, 3000);
      },
      error: (err: string) => {
        this.dialog.open(ErrorDialogComponent, {
          data: {
            message: err
          }
        });
        this.router.navigate(['/']);
      }
    });
  }

  uploadImageHandler(imgFile: any): void {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.image = imgFile.target.files[0];
      this.imageName = this.image.name;
      this.extraFormGroup.patchValue({
        imageName: this.imageName
      });
    } else {
      this.imageName = 'Choose Image';
    }
  }
}
