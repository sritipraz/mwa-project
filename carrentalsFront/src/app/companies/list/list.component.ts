import { Component, inject } from '@angular/core';
import { finalize } from 'rxjs';
import { ApiService } from '../../api.service';
import { ICompany } from './../../interface/company';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styles: [
  ]
})

export class CompanyListComponent {
  loading: boolean = false;
  apiService = inject(ApiService);
  companyList: ICompany[] = [];

  longitude:number|null = null;
  latitude:number|null = null;
  constructor(private toast: ToastrService) {
    this.loading = true;
    this.apiService.getAllCompanies()
    .pipe(
      finalize(() => {
        this.loading = false;
      })
    ).subscribe((res)=> {
      this.companyList = res ;
    })
  }
  name = "";
  searchCompany() {
    this.apiService.getAllCompanies({name:this.name}).subscribe((res)=> {
      this.companyList = res ;
    })
  }
  getNearCompany(): void{
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.longitude = position.coords.longitude;
        this.latitude = position.coords.latitude;
        this.apiService.getAllCompanies({ lng: this.longitude, lat: this.latitude }).subscribe((res) => {
          this.companyList = res;
        });
      });
    } else {
      this.toast.warning("No support for geolocation", "Warning");
    }
  }

  clearFilter(): void{
    this.name = "";
     this.apiService.getAllCompanies({ lng: this.longitude, lat: this.latitude }).subscribe((res)=> {
      this.companyList = res ;
    })
  }
}
