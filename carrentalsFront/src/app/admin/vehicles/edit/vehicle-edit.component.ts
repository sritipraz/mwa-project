import { IVehicle } from './../../../interface/vehicle';
import {  Location } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, map, mergeMap, of } from 'rxjs';
import { ApiService } from 'src/app/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-vehicle-edit',
  templateUrl: './vehicle-edit.component.html',
  styles: [],
})
export class VehicleEditComponent {
  fb = inject(FormBuilder);
  location=inject(Location);
  apiService = inject(ApiService);

  vehicleForm = this.fb.group({
    _id: [''],
    type: ['', Validators.required],
    maker: ['', Validators.required],
    model: ['', Validators.required],
    seaters: [0, Validators.required],
    make: [2023, Validators.required],
    feature: [''],
    description: [''],
  });

  company_id = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastrService
  ) {
    this.activatedRoute.params.subscribe((params) => {
      this.company_id = params['company_id'];
    });

    this.activatedRoute.paramMap
      .pipe(
        map((params) => params.get('vehicle_id') as string),
        mergeMap((vehicle_id) =>
          this.apiService.getVehicleById(this.company_id, vehicle_id)
        )
      )
      .subscribe((response) => {
        const vehicle: IVehicle = response.vehicles[0];
        this.vehicleForm.get('_id')?.patchValue(vehicle._id ? vehicle._id : '');
        this.vehicleForm.get('type')?.patchValue(vehicle.type);
        this.vehicleForm.get('maker')?.patchValue(vehicle.maker);
        this.vehicleForm.get('model')?.patchValue(vehicle.model);
        this.vehicleForm.get('seaters')?.patchValue(vehicle.seaters);
        this.vehicleForm.get('make')?.patchValue(vehicle.make);
        this.vehicleForm
          .get('feature')
          ?.patchValue(vehicle.features?.join(','));
        this.vehicleForm.get('description')?.patchValue(vehicle.description);
      });
  }

  formData: FormData = new FormData();
  file = new File([], '') as File | undefined;
  fileName = '';
  uploadVehicle(e: Event) {
    this.file = (e.target as HTMLInputElement).files?.[0];
    this.fileName = this.file?.name as string;
    if(this.file)
    (
      this.formData.delete('image')
    )
    this.formData.append('image', this.file as Blob);
  }

  loading: boolean = false;

  editVehicle() {
    const features = this.vehicleForm.get('feature')?.value?.split(',');
    (this.vehicleForm as FormGroup).addControl(
      'features',
      this.fb.array(features as Array<string>)
    );
    (this.vehicleForm as FormGroup).removeControl('feature');

    this.loading = true;
    this.apiService
      .editVehicle(
        (this.vehicleForm as FormGroup).value as IVehicle,
        this.company_id,
        this.vehicleForm.get('_id')?.value as string
      )
      .pipe(
        mergeMap(() => {
          if (this.file?.name)
            return this.apiService.uploadImage(
              this.company_id,
              this.vehicleForm.get('_id')?.value as string,
              this.formData
            );
          else return of({ success: true });
        }),
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (response) => {
          if (response.success) {
          this.toast.success('Updated Successfully!', 'Success');
          this.router.navigate(['', 'admin', 'companies', this.company_id]);
        }
        },
        error: (error) => {
          this.toast.error(error?.error?.error??"Update Failed", 'Error');
        },
      });
  }

  goBack() {
    this.location.back();
  }
}
