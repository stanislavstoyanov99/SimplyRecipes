import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-dashboard-navigation',
  templateUrl: './admin-dashboard-navigation.component.html',
  styleUrls: ['./admin-dashboard-navigation.component.scss']
})
export class AdminDashboardNavigationComponent {

  isRecipesClicked: boolean = false;
  isArticlesClicked: boolean = false;
  isCategoriesClicked: boolean = false;
  isUsersClicked: boolean = false;
  isFaqClicked: boolean = false;
  isPrivacyClicked: boolean = false;

  constructor() { }

  onDashboardButtonClick(): void {
    this.isRecipesClicked = false;
    this.isArticlesClicked = false;
    this.isCategoriesClicked = false;
    this.isUsersClicked = false;
    this.isFaqClicked = false;
    this.isPrivacyClicked = false;
  }

  onRecipesButtonClick(): void {
    this.isRecipesClicked = !this.isRecipesClicked;
  }

  onArticlesButtonClick(): void {
    this.isArticlesClicked = !this.isArticlesClicked;
  }

  onCategoriesButtonClick(): void {
    this.isCategoriesClicked = !this.isCategoriesClicked;
  }

  onUsersButtonClick(): void {
    this.isUsersClicked = !this.isUsersClicked;
  }

  onFaqButtonClick(): void {
    this.isFaqClicked = !this.isFaqClicked;
  }

  onPrivacyButtonClick(): void {
    this.isPrivacyClicked = !this.isPrivacyClicked;
  }
}
