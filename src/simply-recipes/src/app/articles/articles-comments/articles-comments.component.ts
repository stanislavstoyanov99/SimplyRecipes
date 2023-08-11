import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faComments, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { ArticleCommentsService } from 'src/app/services/article-comments.service';
import { NgForm } from '@angular/forms';
import { IArticleComment } from 'src/app/shared/interfaces/article-comments/article-comment';
import { IPostArticleComment } from 'src/app/shared/interfaces/article-comments/post-article-comment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';

@Component({
  selector: 'app-articles-comments',
  templateUrl: './articles-comments.component.html',
  styleUrls: ['./articles-comments.component.scss']
})
export class ArticlesCommentsComponent implements OnInit {

  @ViewChild('commentForm') commentForm!: NgForm;
  @Input() articleComments: IArticleComment[] = [];
  @Input() articleId!: number;

  public isUserAuthenticated!: boolean;
  public returnUrl!: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private library: FaIconLibrary,
    private articleCommentsService: ArticleCommentsService,
    private dialog: MatDialog) {
    this.returnUrl = this.router.routerState.snapshot.url;
    this.library.addIcons(faComments, faCalendarAlt);
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
  }

  onSubmitHandler(form: NgForm): void {
    if (form.invalid) { return; }

    const articleComment: IPostArticleComment = {
      articleId: this.articleId,
      parentId: null,
      content: form.value['content']
    };

    this.articleCommentsService.postComment(articleComment).subscribe({
      next: (articleComment) => {
        this.articleComments = [...this.articleComments, articleComment];
        form.reset();
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
