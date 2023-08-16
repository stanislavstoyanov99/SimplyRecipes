import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ArticlesService } from 'src/app/services/articles.service';
import { LoadingService } from 'src/app/services/loading.service';
import { FileTypeValidatorDirective } from 'src/app/shared/custom-validators/file-type-validator.directive';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { ICategoryList } from 'src/app/shared/interfaces/categories/category-list';

@Component({
  selector: 'app-create-article',
  templateUrl: './create-article.component.html',
  styleUrls: ['./create-article.component.scss']
})
export class CreateArticleComponent implements OnInit {

  formGroup: FormGroup;
  imageName: string = '';
  image!: File;
  categories: ICategoryList[] = [];
  
  constructor(public loadingService: LoadingService,
    private formBuilder: FormBuilder,
    private articlesService: ArticlesService,
    private dialog: MatDialog,
    private router: Router) {
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

  onSubmitHandler(formGroup: FormGroup): void {
    if (formGroup.invalid) { return; }

    const { title, description, category } = formGroup.value;
    const articleCreateInputModel = new FormData();
    articleCreateInputModel.append('title', title);
    articleCreateInputModel.append('description', description);
    articleCreateInputModel.append('categoryId', category);
    articleCreateInputModel.append('image', this.image);

    this.articlesService.submitArticle(articleCreateInputModel).subscribe({
      next: (article) => {
        setTimeout(() => {
          this.router.navigate([`/articles/details/${article.id}`]);
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
      title: ['', [Validators.required, Validators.maxLength(30), Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.maxLength(20000), Validators.minLength(50)]],
      image: [null, [FileTypeValidatorDirective.validate]],
      imageName: ['Choose Image'],
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
