import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllArticlesComponent } from './get-all-articles.component';

describe('GetAllArticlesComponent', () => {
  let component: GetAllArticlesComponent;
  let fixture: ComponentFixture<GetAllArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllArticlesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
