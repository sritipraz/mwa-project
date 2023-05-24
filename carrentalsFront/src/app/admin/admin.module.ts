import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VehicleEditComponent } from './vehicles/edit/vehicle-edit.component';
import { VehicleAddComponent } from './vehicles/add/vehicle-add.component';
import { VehicleDetailComponent } from './vehicles/detail/vehicle-detail.component';
import { CompanyAddComponent } from './companies/add/company-add.component';
import { CompanyEditComponent } from './companies/edit/company-edit.component';
import { CompanyDashboardComponent } from './companies/dashboard/company-dashboard.component';
import { CompanyListComponent } from './companies/list/company-list.component';
import { CompanyDetailComponent } from './companies/detail/company-detail.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletComponent } from './leaflet/leaflet.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    VehicleEditComponent,
    VehicleAddComponent,
    VehicleDetailComponent,
    CompanyAddComponent,
    CompanyEditComponent,
    CompanyDashboardComponent,
    CompanyListComponent,
    CompanyDetailComponent,
    LeafletComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LeafletModule,
    SharedModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: CompanyDashboardComponent },
      { path: 'companies', component: CompanyListComponent },
      { path: 'companies/add', component: CompanyAddComponent },
      { path: 'companies/:company_id', component: CompanyDetailComponent },
      { path: 'companies/:company_id/edit', component: CompanyEditComponent },
      { path: 'companies/:company_id/vehicles/add', component: VehicleAddComponent },
      { path: 'companies/:company_id/vehicles/:vehicle_id', component: VehicleDetailComponent },
      { path: 'companies/:company_id/vehicles/:vehicle_id/edit', component: VehicleEditComponent }
    ])
  ]
})
export class AdminModule { }
