import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ArticlesService } from "src/app/services/articles.service";
import { IArticleListing } from "src/app/shared/interfaces/articles/article-listing";
import { PageResult } from "src/app/shared/utils/utils";

@Injectable({
  providedIn: 'root'
})
export class ByCategoryResolver  {
  constructor(private articlesService: ArticlesService, private router: Router) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): PageResult<IArticleListing> | null | Observable<PageResult<IArticleListing>> | Promise<PageResult<IArticleListing>> {
    const categoryName = route.queryParams['categoryName'];
    if (!categoryName) {
      this.router.navigate(['/articles/main']);
      return null;
    }
    return this.articlesService.getArticlesByCategoryName(categoryName, 1);
  }
}