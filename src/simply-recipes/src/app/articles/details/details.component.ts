import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faSearch, faList } from '@fortawesome/free-solid-svg-icons';
import { IArticleDetails } from 'src/app/shared/interfaces/article-details';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  articleDetails: IArticleDetails | null = null;

  constructor(
    private library: FaIconLibrary,
    private activatedRoute: ActivatedRoute) {
    this.library.addIcons(faUser, faCalendar, faSearch, faList);
   }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this.articleDetails = response.article;
    });
  }

}
