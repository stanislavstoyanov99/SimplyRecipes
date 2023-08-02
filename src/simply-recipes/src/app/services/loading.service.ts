import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {

  private isLoading$$ = new BehaviorSubject<boolean>(false);
  isLoading$ = this.isLoading$$.asObservable();

  constructor(private spinner: NgxSpinnerService) { }

  setLoading(isLoading: boolean) {
    if (isLoading) {
      this.spinner.show();
    } else {
      this.spinner.hide();
    }

    this.isLoading$$.next(isLoading);
  }
}
