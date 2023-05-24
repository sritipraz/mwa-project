import { UserServiceService } from './../user-service.service';
import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';
import jwt_decode from "jwt-decode";
import { ILogin } from '../interface/login';
import IUser from '../interface/user';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ],
})
export class LoginComponent {
  loading: boolean = false;
  loginForm = inject(FormBuilder).group({
    email: ['', Validators.required],
    password: ['', Validators.required],
  });

  apiService = inject(ApiService);
  userState = inject(UserServiceService);
  location = inject(Location);
  router = inject(Router);

  constructor(private toast: ToastrService) {
  }
  login() {
    this.loading = true;
    this.apiService.login(this.loginForm.value as ILogin)
      .pipe(finalize(() => {
        this.loading = false;
      })).subscribe(
        {
          next: (response) => {
            if (response.success) {
              const decode: IUser = jwt_decode(response.results);
              this.userState.setUserState({
                ...decode,
                jwt: response.results,
              });
              localStorage.setItem(
                'USER_STATE',
                JSON.stringify({
                  ...decode,
                  jwt: response.results,
                })
              );
              if (window.history.length > 1) {
                this.location.back()
              } else {
                this.router.navigate(['','companies']);
              }
            }
          },
          error: (err) => {
            this.toast.error(err?.error?.error, "Error");
          }
        }
      );
  }

  goToSignup() {
    this.router.navigate(['', 'signup']);
  }
}
