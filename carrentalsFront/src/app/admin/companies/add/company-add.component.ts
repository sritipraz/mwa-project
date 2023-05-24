import { Router } from '@angular/router';
import { IAddCompany } from './../../../interface/company';
import { ApiService } from './../../../api.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Component, inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { MapService } from 'src/app/map.service';
import {  Location } from '@angular/common';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-company-add',
  templateUrl: './company-add.component.html',
  styles: [
  ]
})
export class CompanyAddComponent {
  location = inject(Location);
  loading: boolean = false;
  showMap = false;
  constructor(private toast: ToastrService,private mapService: MapService) {
    this.mapService._mapService.subscribe((data) => {
      this.showMap = data.showMap;
      this.companyForm.get('longitude')?.patchValue(data.lng as number);
      this.companyForm.get('latitude')?.patchValue(data.lat as number);
    })
  }

  mapState() {
    if(this.showMap) {
      this.mapService.hideMap();
    } else {
      this.mapService.showMap();
    }
  }


  mapTitle = this.showMap ? "Hide Map" : "Show Map";
  apiService = inject(ApiService);
  fb = inject(FormBuilder);

  router = inject(Router);
  companyForm = this.fb.group({
    name: ["", Validators.required],
    address: this.fb.group({
       state: ["", Validators.required],
       city: ["", Validators.required],
       zip: ["", Validators.required],
    }),
    longitude: [0],
    latitude: [0],
    phone: ["", Validators.required],
    email: ["", Validators.required],
    website: [""],
    description: [""],
  });

  addCompany() {
    (this.companyForm as FormGroup).addControl('location', this.fb.array([this.companyForm.get('longitude'), this.companyForm.get('latitude')]));
    (this.companyForm as FormGroup).removeControl('longitude');
    (this.companyForm as FormGroup).removeControl('latitude');
    this.loading = true;
    this.apiService.addCompany(this.companyForm.value as IAddCompany)
      .pipe(finalize(() => {
        this.loading = false;
      }))
      .subscribe({
        next: (res) => {
          if (res.success) {
            this.toast.success('Added Successfully!', 'Success');
            this.router.navigate(['', 'admin', 'companies'])
          } else {
            this.toast.error("Error on adding company", "Error");
          }
        },
        error: (err) => this.toast.error(err?.error?.error??"Company Addition Failed", "Error") 
    })
  }
  goBack() {
    this.location.back();
  }
}
