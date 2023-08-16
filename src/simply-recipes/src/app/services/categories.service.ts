import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ICategoryDetails } from '../shared/interfaces/categories/category-details';
import { Observable } from 'rxjs';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private httpClient: HttpClient) { }

  getAllCategories(): Observable<ICategoryDetails[]> {
    return this.httpClient.get<ICategoryDetails[]>(`${apiURL}/categories/all`);
  }

  submitCategory(categoryCreateInputModel: FormData): Observable<ICategoryDetails> {
    return this.httpClient.post<ICategoryDetails>(`${apiURL}/categories/submit`, categoryCreateInputModel);
  }

  removeCategory(categoryId: number): Observable<any> {
    return this.httpClient.delete(`${apiURL}/categories/remove/${categoryId}`);
  }

  editCategory(categoryEditModel: FormData): Observable<ICategoryDetails> {
    return this.httpClient.put<ICategoryDetails>(`${apiURL}/categories/edit`, categoryEditModel);
  }
}
