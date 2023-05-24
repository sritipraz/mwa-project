import { finalize, mergeMap, of } from 'rxjs';
import {  Location } from '@angular/common';
import { IAddVehicle } from './../../../interface/vehicle';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ApiService } from 'src/app/api.service';
import { map } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-add',
  templateUrl: './vehicle-add.component.html',
  styles: [
  ]
})
export class VehicleAddComponent {
  location = inject(Location);
  company_id = "";
  constructor(private route: ActivatedRoute,private router: Router,private toast: ToastrService) {
    this.route.params.subscribe(params => {
      this.company_id = params['company_id'];
    });
   };
  

  fb = inject(FormBuilder);

  apiService = inject(ApiService);


  vehicleForm = this.fb.group({
    type: ["car", Validators.required],
    maker: ["",Validators.required],
    model: ["", Validators.required],
    make: ["2023", Validators.required],
    seaters: [5, Validators.required],
    feature:[""],
    description: [""],
  })


  formData: FormData = new FormData();
  file = new File([], "") as File | undefined;
  uploadVehicle(e: Event) {
    this.file = (e.target as HTMLInputElement).files?.[0];
    if(this.file)
    (
      this.formData.delete('image')
    )
    this.formData.append('image', this.file as Blob);
  }
  loading: boolean = false;

  addVehicle() {
    const features = this.vehicleForm.get('feature')?.value?.split(',');
    (this.vehicleForm as FormGroup).addControl('features', this.fb.array(features as Array<string>));
    (this.vehicleForm as FormGroup).removeControl('feature');

    this.loading = true;
    this.apiService.addVehicle(this.company_id, (this.vehicleForm as FormGroup).value as IAddVehicle).pipe(
      map(response => response.results._id as string),
      mergeMap((id) => {
        if(this.file?.name)
        return this.apiService.uploadImage(this.company_id, id, this.formData)
        else
        return of({success:true})
      }),
      finalize(() => {
        this.loading = false;
      })
    ).subscribe({
      next: (response) => {
        if(response.success) {
        this.toast.success('Added Successfully!', 'Success');
        this.router.navigate(['','admin','companies',this.company_id]);
      }
      },
      error:(error)=>{
        this.toast.error(error?.error?.error??"Vehicle Addition Failed", 'Error');
      }
    })
  }

  goBack() {
    this.location.back();
  }
}
