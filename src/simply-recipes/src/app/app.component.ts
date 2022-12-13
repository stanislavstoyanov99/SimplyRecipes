import { Component } from '@angular/core';
import { ActivationStart, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Simply Recipes';

  constructor(
    private router: Router,
    private pageTitle: Title
  ) {
    this.router.events.pipe(
      filter((e): e is ActivationStart => e instanceof ActivationStart),
      map(e => this.title + ' | ' + e.snapshot.data?.['title']),
      filter((d) => !!d)
    ).subscribe((pageTitle) => {
      this.pageTitle.setTitle(pageTitle);
    });
  }
}
