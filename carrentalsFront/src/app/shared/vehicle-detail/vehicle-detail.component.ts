import { ApiService } from './../../api.service';
import { UserServiceService } from 'src/app/user-service.service';
import { IVehicle } from './../../interface/vehicle';
import { Component, Input, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-common-vehicle-detail',
  templateUrl: './vehicle-detail.component.html',
  styles: [
  ]
})
export class VehicleDetailComponent {
  loading: boolean = false;
  apiService = inject(ApiService);
  vehicle: IVehicle = {
    _id: '',
    type: '',
    maker: '',
    make: 0,
    model: '',
    seaters: 0,
    features: [],
    description: '',
    images: []
  };
  companyId!: string;
  vehicleId!: string;
  imagePath: string = '';
  user: { token: string, isAdmin: boolean } = { token: '', isAdmin: false };
  userState = inject(UserServiceService);
  router = inject(Router);
  constructor(private route: ActivatedRoute,) {
    this.user.token = this.userState.getUserState().jwt;
    this.user.isAdmin = this.userState.getUserState().isAdmin;
    this.route.params.subscribe(params => {
      this.companyId = params['company_id'];
      this.vehicleId = params['vehicle_id'];
    });
    this.loading = true;
    this.apiService.getVehicleById(this.companyId, this.vehicleId)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      ).subscribe((res) => {
        this.vehicle = res.vehicles[0];
        if (this.vehicle.images) {
          if (this.vehicle.images.length !== 0) {
            const len = this.vehicle.images.length
            this.imagePath = `${environment.baseUrl.slice(0, -1)}${this.vehicle.images?.[len - 1]}`;
          }
        }
      })
  }
  routeToBooking() {
    if (this.user.token) {
      return this.router.navigate(["", "companies", this.companyId, "vehicles", this.vehicleId, "booking"]);
    } else {
      return this.router.navigate(["", "login"]);
    }
  }
}
