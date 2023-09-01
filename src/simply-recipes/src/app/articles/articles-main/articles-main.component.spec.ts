import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesMainComponent } from './articles-main.component';

describe('ArticlesMainComponent', () => {
  let component: ArticlesMainComponent;
  let fixture: ComponentFixture<ArticlesMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesMainComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
