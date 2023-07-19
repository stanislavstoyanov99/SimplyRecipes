import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-by-category',
  templateUrl: './by-category.component.html',
  styleUrls: ['./by-category.component.scss']
})
export class ByCategoryComponent implements OnInit {

  categoryName!: string;
  articlesByCategory!: IArticleListing[];

  constructor(private activatedRoute: ActivatedRoute, private library: FaIconLibrary) {
    this.library.addIcons(faUser, faCalendar, faComments);
  }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ articlesByCategory }) => {
      this.articlesByCategory = articlesByCategory;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      this.categoryName = params['categoryName'];
    });
  }

}
