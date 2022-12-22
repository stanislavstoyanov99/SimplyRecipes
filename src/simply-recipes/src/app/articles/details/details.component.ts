import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faCalendar, faUser, faSearch, faList, faComments } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { IArticleDetails } from 'src/app/shared/interfaces/articles/article-details';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent implements OnInit {

  articleDetails!: IArticleDetails;
  public isUserAuthenticated!: boolean;
  public returnUrl!: string;

  constructor(
    private library: FaIconLibrary,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router) {
    this.library.addIcons(faUser, faCalendar, faSearch, faList, faComments);
    this.returnUrl = this.router.routerState.snapshot.url;
   }

  ngOnInit(): void {
    this.activatedRoute.data.subscribe((response: any) => {
      this.articleDetails = response.article;
    });

    this.authService.authChanged
      .subscribe({
        next: (value) => {
          this.isUserAuthenticated = value;
        },
        error: (err) => {
          console.error(err); // TODO: Add global error handler
        }
    });
  }

  onSubmit(): void {
  }

}
