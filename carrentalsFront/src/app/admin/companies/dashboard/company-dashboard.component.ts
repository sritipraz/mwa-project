import { Component, inject } from '@angular/core';
import { ApiService } from '../../../api.service';
import { finalize } from 'rxjs';
@Component({
  selector: 'app-company-dashboard',
  templateUrl: './company-dashboard.component.html',
  styles: [
  ]
})
export class CompanyDashboardComponent {
  loading: boolean = false;
  apiService = inject(ApiService);
  companyCount: Number = 0;
  vehicleTypesCount: { type: string, count: Number }[] = [];
  constructor() {
    this.loading = true;
    this.apiService.getCompanyCount()
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((res) => {
      this.companyCount = res;
    })
    this.loading = true;
    this.apiService.getVehicleByCompanyAndTypeCount()
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((res) => {
      let types: string[] = [];
      res.forEach((data) => {
        if (types.indexOf(data.type?.toLocaleLowerCase()) === -1) {
          types.push(data.type?.toLocaleLowerCase());
        }
      })
      types.forEach(type => {
        const list = res.filter(data => data.type?.toLowerCase() == type)
        const count = list.reduce((acc, current) => acc + (current.count as number), 0)
        this.vehicleTypesCount.push({ type, count: count ? count : 0 })
      })
    })
  }
}
