import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 0) {
          this.show('Serveur indisponible, veuillez réessayer plus tard', 5000, ['snack-error']);
        } else if (error.status === 500) {
          this.show('Une erreur serveur est survenue', 4000, []);
        } else if (error.status === 403) {
          this.show('Accès refusé', 3000, []);
        }
        // 401 and 404: handled locally — do nothing here
        return throwError(() => error);
      })
    );
  }

  private show(message: string, duration: number, panelClass: string[]): void {
    this.snackBar.open(message, 'Fermer', { duration, panelClass });
  }
}
