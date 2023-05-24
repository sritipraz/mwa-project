import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from './loader/loader.component';
import { VehicleDetailComponent } from './vehicle-detail/vehicle-detail.component';
import { InfoComponent } from './info/info.component';

@NgModule({
  declarations: [
    LoaderComponent,
    VehicleDetailComponent,
    InfoComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [LoaderComponent, VehicleDetailComponent,InfoComponent]
})
export class SharedModule { }
