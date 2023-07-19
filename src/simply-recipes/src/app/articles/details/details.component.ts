import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import { IArticleListing } from 'src/app/shared/interfaces/articles/article-listing';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  article!: IArticleListing;

  constructor(
    private library: FaIconLibrary,
    private activatedRoute: ActivatedRoute) {
    this.library.addIcons(faUser, faCalendar, faList);
   }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ article }) => {
      this.article = article;
    });
  }

}
