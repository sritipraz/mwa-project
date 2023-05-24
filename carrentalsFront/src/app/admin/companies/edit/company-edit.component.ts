import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { map, mergeMap } from 'rxjs';
import { ICompany } from 'src/app/interface/company';
import { ToastrService } from 'ngx-toastr';
import {  Location } from '@angular/common';
import { finalize } from 'rxjs';
import { MapService } from 'src/app/map.service';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styles: [
  ]
})
export class CompanyEditComponent {
  location = inject(Location);
  loading: boolean = false;
  showMap = false;
  activatedRoute= inject(ActivatedRoute);
  apiService = inject(ApiService);
  fb = inject(FormBuilder);
  router=inject(Router);

  companyForm = this.fb.group({
    _id: [""],
    name: ["", Validators.required],
    address: this.fb.group({
       state: ["", Validators.required],
       city: ["", Validators.required],
       zip: ["", Validators.required],
    }),
    longitude: [0, Validators.required],
    latitude: [0, Validators.required],
    phone: ["", Validators.required],
    email: ["", Validators.required],
    website: [""],
    description: [""],
  });

  constructor(private toast: ToastrService,private mapService: MapService) {
    
    this.activatedRoute.paramMap.pipe(
      map(params=>params.get("company_id") as string),
      mergeMap(company_id=>this.apiService.getCompanyById(company_id))

    )
    .subscribe((response) => {
      this.companyForm.get('_id')?.patchValue(response._id? response._id:"")
      this.companyForm.get('name')?.patchValue(response.name)
      this.companyForm.get('address.state')?.patchValue(response.address.state)
      this.companyForm.get('address.city')?.patchValue(response.address.city)
      this.companyForm.get('address.zip')?.patchValue(response.address.zip)
      this.companyForm.get('longitude')?.patchValue(response.location[0]? Number(response.location[0]):0)
      this.companyForm.get('latitude')?.patchValue(response.location[1]? Number(response.location[1]):0)
      this.companyForm.get('phone')?.patchValue(response.phone)
      this.companyForm.get('email')?.patchValue(response.email)
      this.companyForm.get('website')?.patchValue(response.website)
      this.companyForm.get('description')?.patchValue(response.description)
    })

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

  editCompany() {
    (this.companyForm as FormGroup).addControl('location', this.fb.array([this.companyForm.get('longitude'), this.companyForm.get('latitude')]));
    (this.companyForm as FormGroup).removeControl('longitude');
    (this.companyForm as FormGroup).removeControl('latitude');
    this.loading = true;
    this.apiService.editCompany(this.companyForm.value as ICompany,this.companyForm.get('_id')?.value as string )
    .pipe(finalize(() => {
      this.loading = false;
    }))
      .subscribe(
      {
        next: (res) => {
          if (res.success) {
            this.toast.success('Updated Successfully!', 'Success');
            this.router.navigate(['', 'admin', 'companies'])
          } else {
            this.toast.error("Error on editing company", "Error");
          }
        },
          error: (err) => {
          this.toast.error(err?.error?.error??"Update Failed", "Error");
        }
      }
    );
  }
  goBack() {
    this.location.back();
  }
}
