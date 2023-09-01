import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesByCategoryComponent } from './articles-by-category.component';

describe('ArticlesByCategoryComponent', () => {
  let component: ArticlesByCategoryComponent;
  let fixture: ComponentFixture<ArticlesByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesByCategoryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
