import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAllRecipesComponent } from './get-all-recipes.component';

describe('GetAllRecipesComponent', () => {
  let component: GetAllRecipesComponent;
  let fixture: ComponentFixture<GetAllRecipesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetAllRecipesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GetAllRecipesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
