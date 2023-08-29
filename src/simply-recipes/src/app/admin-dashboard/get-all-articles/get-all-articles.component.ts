import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ArticlesService } from 'src/app/services/articles.service';
import { ArticleEditDialogComponent, EditArticleDialogModel } from 'src/app/shared/dialogs/article-edit-dialog/article-edit-dialog.component';
import { ConfirmDialogModel, ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { IArticleDetails } from 'src/app/shared/interfaces/articles/article-details';
import { PageResult } from 'src/app/shared/utils/utils';

@Component({
  selector: 'app-get-all-articles',
  templateUrl: './get-all-articles.component.html',
  styleUrls: ['./get-all-articles.component.scss']
})
export class GetAllArticlesComponent implements OnInit {

  articlesPaginated: PageResult<IArticleDetails> = {
    count: 0,
    items: [],
    pageNumber: 1,
    pageSize: 0
  };
  pageNumber: number = 1;
  pageSize: number = 10;
  count: number = 0;

  constructor(
    private articlesService: ArticlesService,
    private dialog: MatDialog) { }

    ngOnInit(): void {
      this.getArticlesPaginated(1);
    }
  
    onEditHandler(article: IArticleDetails): void {
      const title = `Edit ${article.title} article with id: ${article.id}`;
      const dialogData = new EditArticleDialogModel(title, article);
      const dialogRef = this.dialog.open(ArticleEditDialogComponent, {
        width: '50%',
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(article => {
        if (article) {
          this.articlesService.editArticle(article).subscribe({
            next: (article) => {
              const indexOfUpdatedArticle = this.articlesPaginated.items.findIndex(x => x.id === article.id);
              this.articlesPaginated.items[indexOfUpdatedArticle] = article;
            },
            error: (err: string) => {
              this.dialog.open(ErrorDialogComponent, {
                data: { message: err }
              });
            }
          });
        }
      });
    }
  
    onRemoveHandler(articleId: number): void {
      const message = 'Are you sure you want to delete this article?';
      const dialogData = new ConfirmDialogModel('Confirmation', message);
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        data: dialogData
      });
  
      dialogRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult) {
          this.articlesService.removeArticle(articleId).subscribe({
            next: () => {
              const indexOfDeletedArticle = this.articlesPaginated.items.findIndex(x => x.id === articleId);
              this.articlesPaginated.items.splice(indexOfDeletedArticle!, 1);
            },
            error: (err: string) => {
              this.dialog.open(ErrorDialogComponent, {
                data: { message: err }
              });
            }
          });
        }
      });
    }

    onPageChange(pageNumber: number): void {
      this.getArticlesPaginated(pageNumber);
    }

    private getArticlesPaginated(pageNumber?: number) {
      this.articlesService.getAllArticles(pageNumber).subscribe({
        next: (articlesPaginated) => {
          this.articlesPaginated = articlesPaginated;
          this.pageNumber = this.articlesPaginated.pageNumber;
          this.count = this.articlesPaginated.count;
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
