import { UserServiceService } from './user-service.service';
import { Injectable, inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';

@Injectable()
export class RequestInterceptor implements HttpInterceptor {

  userService = inject(UserServiceService);

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = this.userService.getUserState().jwt;

    if (token) {
      const new_request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${this.userService.getUserState().jwt}`
      }
    });
       return next.handle(new_request);
    }
    return next.handle(request);
    
  }
}
