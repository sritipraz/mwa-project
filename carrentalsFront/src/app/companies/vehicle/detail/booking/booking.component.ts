import { UserServiceService } from './../../../../user-service.service';
import { IBooking } from './../../../../interface/booking';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, inject } from '@angular/core';
import {  Location } from '@angular/common';
import { finalize } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
})
export class BookingComponent {
  location = inject(Location);
  loading: boolean = false;
  apiService = inject(ApiService);
  router = inject(Router);

  userState = inject(UserServiceService);

  bookingForm = this.fb.group({
    start_date: ['', Validators.required],
    end_date: ['', Validators.required],
  });

  vehicleId = "";
  companyId = "";

  constructor(private fb:FormBuilder,private route:ActivatedRoute, private toastr: ToastrService) {
    this.route.params.subscribe((params) => {
      this.vehicleId = params["vehicle_id"];
      this.companyId = params["company_id"];
    });
  }

  bookVehicle() {
    (this.bookingForm as FormGroup).addControl("user_nmae",this.fb.control(this.userState.getUserState().fullname));
    (this.bookingForm as FormGroup).addControl("user_email", this.fb.control(this.userState.getUserState().email));
    this.loading = true;
    this.apiService.bookVehicle(this.vehicleId, this.companyId, this.bookingForm.value as IBooking)
    .pipe(finalize(() => {
      this.loading = false;
    })).subscribe((res) => {
      if (res.success) {
        this.router.navigate(["", "companies", this.companyId, "vehicles", this.vehicleId]);
        this.toastr.success('Request Sent Successfully!', 'Success');
      }
    });
  }

  goBack() {
    this.location.back();
  }
}
