import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendarAlt, faReply } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, fromEvent, take } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { IArticleComment } from 'src/app/shared/interfaces/article-comments/article-comment';

@Component({
  selector: 'app-articles-comment',
  templateUrl: './articles-comment.component.html',
  styleUrls: ['./articles-comment.component.scss']
})
export class ArticlesCommentComponent implements OnInit {

  @Input() comment!: IArticleComment;
  @Input() articleComments!: IArticleComment[];
  @Input() element!: ElementRef;
  @Output() parentIdEvent = new EventEmitter<number>();
  
  public isUserAuthenticated!: boolean;

  constructor(
    private authService: AuthService,
    private library: FaIconLibrary) {
      this.library.addIcons(faCalendarAlt, faReply);
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
  }

  onReplyCommentHandler(commentId: number): void {
    this.scrollToCommentSubmitForm();
    this.parentIdEvent.emit(commentId);
  }

  getCommentReplies(commentId: number): IArticleComment[] {
    let replies = this.articleComments
      .filter((comment) => comment.parentId === commentId)
      .sort((a, b) => a.createdOn.getTime() - new Date(b.createdOn).getTime());

    return replies;
  }

  private scrollToCommentSubmitForm(): void {
    const commentFormElement: HTMLElement = this.element.nativeElement.querySelector(
      "#comment-form"
    );
    const commentTextareaElement: HTMLElement = this.element.nativeElement.querySelector(
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
