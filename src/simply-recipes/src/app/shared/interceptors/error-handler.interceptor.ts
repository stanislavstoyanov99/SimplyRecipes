import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorHandlerInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req)
    .pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = this.handleError(error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private handleError = (error: HttpErrorResponse): string => {
    if (error.status === HttpStatusCode.NotFound) {
      return this.handleNotFound(error);
    }
    else if (error.status === HttpStatusCode.BadRequest) {
      return this.handleBadRequest(error);
    }
    else if (error.status === HttpStatusCode.Unauthorized) {
      return this.handleUnauthorized(error);
    }
    return '';
  }

  private handleNotFound = (error: HttpErrorResponse): string => {
    this.router.navigate(['/404']);
    return error.message;
  }

  private handleBadRequest = (error: HttpErrorResponse): string => {
    if (this.router.url === '/auth/register') {
      let message = '';
      const errors = error.error.errors.split(', ');
      errors.map((m: string) => {
         message += m + '<br>';
      });
      return message.slice(0, -4);
    }
    else {
      return error.error ? error.error : error.message;
    }
  }

  private handleUnauthorized = (error: HttpErrorResponse) => {
    if (this.router.url === '/auth/login') {
      return error.error.errors;
    }
    else {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: this.router.url }});
      return error.message;
    }
  }
}
