import { ISignup } from './../interface/signup';
import { ApiService } from './../api.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [
  ]
})
export class SignupComponent {
  loading: boolean = false;
  constructor(private toast: ToastrService) {

  }
  matchValidator(
    matchTo: string,
    reverse?: boolean
  ): ValidatorFn {
    return (control: AbstractControl):
      ValidationErrors | null => {
      if (control.parent && reverse) {
        const c = (control.parent?.controls as any)[matchTo] as AbstractControl;
        if (c) {
          c.updateValueAndValidity();
        }
        return null;
      }
      return !!control.parent &&
        !!control.parent.value &&
        control.value ===
        (control.parent?.controls as any)[matchTo].value
        ? null
        : { matching: true };
    };
  }

  signupForm = inject(FormBuilder).group({
    fullname: ['', Validators.required],
    email: ['', Validators.required],
    password: ['', Validators.required],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (group: AbstractControl): ValidationErrors | null => {
      let pass = group.get('password')?.value;
      let confirmPass = group.get('confirmPassword')?.value
      return pass === confirmPass ? null : { notSame: true }
    }
  })

  apiService = inject(ApiService);
  router = inject(Router);

  signup() {
    (this.signupForm as FormGroup).removeControl('confirmPassword');
    this.loading = true;
    this.apiService.signup(this.signupForm.value as ISignup)
      .pipe(finalize(() => {
        this.loading = false;
      })).subscribe({
        next: (data) => {
          this.router.navigate(['/verify']);
        },
        error: (err) => {
          this.toast.error(err?.error?.error, "Error");
        }
      })
  }
}