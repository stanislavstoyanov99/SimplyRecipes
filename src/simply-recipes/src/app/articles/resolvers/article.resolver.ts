import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { ArticlesService } from "src/app/services/articles.service";
import { IArticleListing } from "src/app/shared/interfaces/articles/article-listing";

@Injectable({
  providedIn: 'root'
})
export class ArticleResolver implements Resolve<IArticleListing | null> {
  constructor(private articlesService: ArticlesService, private router: Router) { }
  
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): IArticleListing | null | Observable<IArticleListing> | Promise<IArticleListing> {
    const articleId = route.params['id'];
    if (!articleId) {
      this.router.navigate(['/articles/main']);
      return null;
    }
    return this.articlesService.getArticleById(articleId);
  }
}