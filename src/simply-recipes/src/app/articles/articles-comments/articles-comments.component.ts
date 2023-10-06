import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { ArticleCommentsService } from 'src/app/services/article-comments.service';
import { NgForm } from '@angular/forms';
import { IArticleComment } from 'src/app/shared/interfaces/article-comments/article-comment';
import { IPostArticleComment } from 'src/app/shared/interfaces/article-comments/post-article-comment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { LoadingService } from 'src/app/services/loading.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

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
  public rootArticleComments: IArticleComment[] = [];
  public commentsLength!: number;

  private parentId: number | null = null;

  constructor(
    public loadingService: LoadingService,
    public element: ElementRef,
    private authService: AuthService,
    private router: Router,
    private articleCommentsService: ArticleCommentsService,
    private dialog: MatDialog,
    private library: FaIconLibrary) {
    this.returnUrl = this.router.routerState.snapshot.url;
    this.library.addIcons(faComments);
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
    this.rootArticleComments = this.articleComments.filter((comment) => !comment.parentId);
    this.commentsLength = this.articleComments.length;
  }

  onSubmitHandler(form: NgForm): void {
    if (form.invalid) { return; }

    const articleComment: IPostArticleComment = {
      articleId: this.articleId,
      parentId: this.parentId,
      content: form.value['content']
    };

    this.postComment(form, articleComment);
  }

  setCommentParentId(parentId: number): void {
    this.parentId = parentId;
  }

  private postComment(form: NgForm, articleComment: IPostArticleComment): void {
    this.articleCommentsService.postComment(articleComment).subscribe({
      next: (articleComment) => {
        if (!articleComment.parentId) {
          this.rootArticleComments = [...this.rootArticleComments, articleComment];
        } else {
          this.articleComments = [...this.articleComments, articleComment];
        }
        this.parentId = null;
        this.commentsLength++;
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
