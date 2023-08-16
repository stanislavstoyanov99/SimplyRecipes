import { Component, Inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { IRecipeDetails } from '../../interfaces/recipes/recipe-details';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FileTypeValidatorDirective } from '../../custom-validators/file-type-validator.directive';
import { Difficulty } from '../../enums/difficulty';
import { MatSelectModule } from '@angular/material/select';
import { ICategoryList } from '../../interfaces/categories/category-list';
import { RecipesService } from 'src/app/services/recipes.service';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { IRecipeListing } from '../../interfaces/recipes/recipe-listing';

@Component({
  selector: 'app-recipe-edit-dialog',
  templateUrl: './recipe-edit-dialog.component.html',
  styleUrls: ['./recipe-edit-dialog.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    CommonModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatToolbarModule]
})
export class RecipeEditDialogComponent implements OnInit {

  title: string;
  recipe: IRecipeDetails;
  formGroup: FormGroup;
  difficulties: string[] = Object.keys(Difficulty).filter((key) => Number.isNaN(parseInt(key, 10)));
  categories: ICategoryList[] = [];
  imageName: string = 'Choose Image';
  image!: File;

  constructor(
    public dialogRef: MatDialogRef<RecipeEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditRecipeDialogModel,
    private formBuilder: FormBuilder,
    private recipesService: RecipesService,
    private dialog: MatDialog) {
      this.title = data.title;
      this.recipe = data.recipe;
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

  createForm(): FormGroup {
    this.formGroup = this.formBuilder.group({
      name: [this.recipe.name, [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      description: [this.recipe.sanitizedDescription, [Validators.required, Validators.maxLength(20000), Validators.minLength(50)]],
      ingredients: [this.recipe.sanitizedIngredients, [Validators.required, Validators.maxLength(20000), Validators.minLength(10)]],
      preparationTime: [this.recipe.preparationTime, [Validators.max(180), Validators.min(0)]],
      cookingTime: [this.recipe.cookingTime, [Validators.max(180), Validators.min(0)]],
      portionsNumber: [this.recipe.portionsNumber, [Validators.max(12), Validators.min(0)]],
      oldImage: [this.recipe.imagePath],
      image: [null, [FileTypeValidatorDirective.validate]],
      imageName: [this.imageName],
      difficulty: [Difficulty[this.recipe.difficulty], Validators.required],
      category: [this.recipe.categoryId, Validators.required]
    });
    return this.formGroup;
  }

  onConfirm(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { cookingTime, description, ingredients, name, portionsNumber, preparationTime, category, difficulty } = formGroup.value;
    const recipeEditModel = new FormData();
    recipeEditModel.append('id', this.recipe.id.toString());
    recipeEditModel.append('name', name);
    recipeEditModel.append('description', description);
    recipeEditModel.append('ingredients', ingredients);
    recipeEditModel.append('preparationTime', preparationTime);
    recipeEditModel.append('cookingTime', cookingTime);
    recipeEditModel.append('portionsNumber', portionsNumber);
    recipeEditModel.append('difficulty', difficulty);
    recipeEditModel.append('categoryId', category);
    recipeEditModel.append('image', this.image);

    this.dialogRef.close(recipeEditModel);
  }

  onDismiss(): void {
    this.dialogRef.close(null);
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

export class EditRecipeDialogModel {
  constructor(public title: string, public recipe: IRecipeDetails) {}
}
