import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesCommentsComponent } from './articles-comments.component';

describe('ArticlesCommentsComponent', () => {
  let component: ArticlesCommentsComponent;
  let fixture: ComponentFixture<ArticlesCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesCommentsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
