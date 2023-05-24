import { NonAdminGuard } from './guards/non-admin.guard';
import { AdminGuard } from './guards/admin.guard';
import { RequestInterceptor } from './request.interceptor';
import { UserServiceService } from './user-service.service';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { LayoutComponent } from './layout/layout.component';
import { CompanyListComponent } from './companies/list/list.component';
import { CompanyDetailComponent } from './companies/detail/detail.component';
import { VehicleDetailComponent } from './companies/vehicle/detail/detail.component';
import { ToastrModule } from 'ngx-toastr';
import { BookingComponent } from './companies/vehicle/detail/booking/booking.component';
import { NotloggedInGuard } from './guards/notloggedin.guard';
import { SharedModule } from './shared/shared.module';
import { ErrorComponent } from './error/error.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

function initializeAppFactory(apiService: UserServiceService): () => void {
  return () => {
    const localstorage_state=localStorage.getItem('USER_STATE')
    if(localstorage_state)
    {
      apiService.setUserState(JSON.parse(localstorage_state))
    }
  }
 }

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    LayoutComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    VehicleDetailComponent,
    BookingComponent,
    ErrorComponent,
    VerifyEmailComponent,
  ],
  imports: [
    BrowserModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/companies', pathMatch: 'full' },
      { path: 'signup', component: SignupComponent, canActivate: [NotloggedInGuard]},
      { path: 'login', component: LoginComponent, canActivate: [NotloggedInGuard]},
      { path: 'error', component: ErrorComponent, canActivate: [NotloggedInGuard]},
      { path: 'verify', component: VerifyEmailComponent, canActivate: [NotloggedInGuard]},
      {
        path: 'companies',
        component: LayoutComponent,
        canActivate: [NonAdminGuard],
        children: [
          {
            path: '', // child route path
            component: CompanyListComponent, // child route component that the router renders
          },
          {
            path: ':company_id',
            component: CompanyDetailComponent, // another child route component that the router renders
          },
          {
            path: ':company_id/vehicles/:vehicle_id',
            component: VehicleDetailComponent, // another child route component that the router renders
          },
          {
            path: ':company_id/vehicles/:vehicle_id/booking',
            component:BookingComponent
          }
        ]
      },
      {
        path: 'admin',
        component: LayoutComponent,
        loadChildren: () => import('./admin/admin.module').then(module => module.AdminModule),
        canActivate:[AdminGuard]
      }
    ])
  ],
  providers: [{
    provide:APP_INITIALIZER,
    useFactory:initializeAppFactory,
    deps:[UserServiceService],
    multi:true
  }, {
    provide: HTTP_INTERCEPTORS,
    useClass: RequestInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }
