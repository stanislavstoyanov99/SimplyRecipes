import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesCommentComponent } from './articles-comment.component';

describe('ArticlesCommentComponent', () => {
  let component: ArticlesCommentComponent;
  let fixture: ComponentFixture<ArticlesCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesCommentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
