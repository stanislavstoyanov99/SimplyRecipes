import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { LoadingService } from 'src/app/services/loading.service';
import { RecipesService } from 'src/app/services/recipes.service';
import { FileTypeValidatorDirective } from 'src/app/shared/custom-validators/file-type-validator.directive';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { Difficulty } from 'src/app/shared/enums/difficulty';
import { ICategoryList } from 'src/app/shared/interfaces/categories/category-list';

@Component({
  selector: 'app-create-recipe',
  templateUrl: './create-recipe.component.html',
  styleUrls: ['./create-recipe.component.scss']
})
export class CreateRecipeComponent implements OnInit {

  formGroup: FormGroup;
  imageName: string = '';
  image!: File;
  difficulties: string[] = Object.keys(Difficulty).filter((key) => Number.isNaN(parseInt(key, 10)));
  categories: ICategoryList[] = [];

  constructor(
    public loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private dialog: MatDialog,
    private router: Router) {
    this.formGroup = this.createForm();
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

  onSubmitHandler(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { cookingTime, description, ingredients, name, portionsNumber, preparationTime, category, difficulty } = formGroup.value;
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

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(20000), Validators.minLength(50)]],
      ingredients: ['', [Validators.required, Validators.maxLength(20000), Validators.minLength(10)]],
      preparationTime: [0, [Validators.max(180), Validators.min(0)]],
      cookingTime: [0, [Validators.max(180), Validators.min(0)]],
      portionsNumber: [0, [Validators.max(12), Validators.min(0)]],
      image: [null, [FileTypeValidatorDirective.validate]],
      imageName: ['Choose Image'],
      difficulty: [null, Validators.required],
      category: [null, Validators.required]
    });
    return this.formGroup;
  }

  uploadImageHandler(imgFile: any): void {
    if (imgFile.target.files && imgFile.target.files[0]) {
      this.image = imgFile.target.files[0];
      this.imageName = this.image.name;
      this.formGroup.patchValue({
        imageName: this.imageName
      });
    } else {
      this.imageName = 'Choose Image';
    }
  }
}
