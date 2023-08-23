import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IStatistics } from '../shared/interfaces/admin-dashboard/statistics';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})
export class AdminDashboardService {

  constructor(private httpClient: HttpClient) { }

  getStatistics(): Observable<IStatistics> {
    return this.httpClient.get<IStatistics>(`${apiURL}/admindashboard/statistics`);
  }
}
