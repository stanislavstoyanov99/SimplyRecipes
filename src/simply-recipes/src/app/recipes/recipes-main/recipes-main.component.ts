import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-recipes-main',
  templateUrl: './recipes-main.component.html',
  styleUrls: ['./recipes-main.component.scss']
})
export class RecipesMainComponent implements OnInit {

  categoryName!: string;
  
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.categoryName = params['categoryName'];
    });
  }

}
