import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faComments } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-articles-comments',
  templateUrl: './articles-comments.component.html',
  styleUrls: ['./articles-comments.component.scss']
})
export class ArticlesCommentsComponent implements OnInit {

  public isUserAuthenticated!: boolean;
  public returnUrl!: string;

  constructor(private authService: AuthService, private router: Router, private library: FaIconLibrary) {
    this.returnUrl = this.router.routerState.snapshot.url;
    this.library.addIcons(faComments);
  }

  ngOnInit(): void {
    this.isUserAuthenticated = this.authService.isUserAuthenticated();
  }

  onSubmitHandler(): void {
  }
}
