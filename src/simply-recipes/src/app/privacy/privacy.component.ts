import { Component, OnInit } from '@angular/core';
import { HomeService } from '../services/home.service';
import { IPrivacy } from '../shared/interfaces/privacy/privacy';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  privacy: IPrivacy | null = null;

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.getPrivacy().subscribe({
      next: (value) => {
        this.privacy = value;
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

}
