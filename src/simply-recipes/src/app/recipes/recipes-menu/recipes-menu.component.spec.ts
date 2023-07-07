import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecipesMenuComponent } from './recipes-menu.component';

describe('RecipesMenuComponent', () => {
  let component: RecipesMenuComponent;
  let fixture: ComponentFixture<RecipesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecipesMenuComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecipesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
