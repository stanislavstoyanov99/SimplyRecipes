import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesMenuComponent } from './articles-menu.component';

describe('ArticlesMenuComponent', () => {
  let component: ArticlesMenuComponent;
  let fixture: ComponentFixture<ArticlesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
