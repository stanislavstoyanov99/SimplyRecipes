import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faComments, faCalendarAlt, faReply } from '@fortawesome/free-solid-svg-icons';
import { ArticleCommentsService } from 'src/app/services/article-comments.service';
import { NgForm } from '@angular/forms';
import { IArticleComment } from 'src/app/shared/interfaces/article-comments/article-comment';
import { IPostArticleComment } from 'src/app/shared/interfaces/article-comments/post-article-comment';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from 'src/app/shared/dialogs/error-dialog/error-dialog.component';
import { debounceTime, fromEvent, take } from 'rxjs';

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

  private parentId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private library: FaIconLibrary,
    private articleCommentsService: ArticleCommentsService,
    private dialog: MatDialog,
    private el: ElementRef) {
    this.returnUrl = this.router.routerState.snapshot.url;
    this.library.addIcons(faComments, faCalendarAlt, faReply);
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
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

  onReplyCommentHandler(commentId: number): void {
    this.scrollToCommentSubmitForm();
    this.parentId = commentId;
  }

  private postComment(form: NgForm, articleComment: IPostArticleComment): void {
    this.articleCommentsService.postComment(articleComment).subscribe({
      next: (articleComment) => {
        this.articleComments = [...this.articleComments, articleComment];
        this.parentId = null;
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

  private scrollToCommentSubmitForm(): void {
    const commentFormElement: HTMLElement = this.el.nativeElement.querySelector(
      "#comment-form"
    );
    const commentTextareaElement: HTMLElement = this.el.nativeElement.querySelector(
      "#content-textarea"
    );

    window.scroll({
      top: this.getTopOffset(commentFormElement),
      left: 0,
      behavior: "smooth"
    });

    fromEvent(window, "scroll")
      .pipe(
        debounceTime(100),
        take(1)
      )
      .subscribe(() => commentTextareaElement.focus());
  }

  private getTopOffset(controlEl: HTMLElement): number {
    const labelOffset = 100;
    return controlEl.getBoundingClientRect().top + window.scrollY - labelOffset;
  }
}
