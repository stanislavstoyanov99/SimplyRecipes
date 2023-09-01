import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesDetailsComponent } from './articles-details.component';

describe('ArticlesDetailsComponent', () => {
  let component: ArticlesDetailsComponent;
  let fixture: ComponentFixture<ArticlesDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
