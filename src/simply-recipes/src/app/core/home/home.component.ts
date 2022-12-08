import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { IRecipeListing } from 'src/app/shared/interfaces/recipe-listing';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  topRecipes: IRecipeListing[] | null = null;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getTopRecipes().subscribe({
      next: (value) => {
        this.topRecipes = value;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
