import { Component, Inject, OnInit } from '@angular/core';
import { ICategoryList } from '../../interfaces/categories/category-list';
import { IArticleDetails } from '../../interfaces/articles/article-details';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ArticlesService } from 'src/app/services/articles.service';
import { FileTypeValidatorDirective } from '../../custom-validators/file-type-validator.directive';
import { ErrorDialogComponent } from '../error-dialog/error-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-article-edit-dialog',
  templateUrl: './article-edit-dialog.component.html',
  styleUrls: ['./article-edit-dialog.component.scss'],
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
export class ArticleEditDialogComponent implements OnInit {

  title: string;
  article: IArticleDetails;
  formGroup: FormGroup;
  categories: ICategoryList[] = [];
  imageName: string = 'Choose Image';
  image!: File;

  constructor(
    public dialogRef: MatDialogRef<ArticleEditDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: EditArticleDialogModel,
    private formBuilder: FormBuilder,
    private articlesService: ArticlesService,
    private dialog: MatDialog) {
      this.title = data.title;
      this.article = data.recipe;
      this.formGroup = this.createForm();
  }

  ngOnInit(): void {
    this.articlesService.getArticleCategories().subscribe({
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
      title: [this.article.title, [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      description: [this.article.sanitizedDescription, [Validators.required, Validators.maxLength(20000), Validators.minLength(50)]],
      oldImage: [this.article.imagePath],
      image: [null, [FileTypeValidatorDirective.validate]],
      imageName: [this.imageName],
      category: [this.article.categoryId, Validators.required]
    });
    return this.formGroup;
  }

  onConfirm(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { title, description, category } = formGroup.value;
    const articleEditModel = new FormData();
    articleEditModel.append('id', this.article.id.toString());
    articleEditModel.append('title', title);
    articleEditModel.append('description', description);
    articleEditModel.append('categoryId', category);
    articleEditModel.append('image', this.image);

    this.dialogRef.close(articleEditModel);
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

export class EditArticleDialogModel {
  constructor(public title: string, public recipe: IArticleDetails) {}
}
