import { TestBed } from '@angular/core/testing';

import { ArticleCommentsService } from './article-comments.service';

describe('ArticleCommentsService', () => {
  let service: ArticleCommentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ArticleCommentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
