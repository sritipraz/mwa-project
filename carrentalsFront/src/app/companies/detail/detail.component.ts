import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../../api.service';
import { IVehicle } from './../../interface/vehicle';
import { ICompany } from './../../interface/company';
import { finalize } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styles: [
  ]
})
export class CompanyDetailComponent {
  loading: {company: boolean, vehicles: boolean} = {company: false, vehicles: false};
  apiService = inject(ApiService);
  company: ICompany = {
    _id: '',
    name: '',
    location: [],
    address: {
      city: '',
      state: '',
      zip: ''
    },
    phone: '',
    email: '',
    website: '',
    description: ''
  };
  companyId!: string;
  vehicleList: IVehicle[] = [];
  vehicleTypes: string[] = [];
  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      this.companyId = params['company_id'];
    });
    this.loading.company = true;
    this.apiService.getCompanyById(this.companyId)
    .pipe(
      finalize(() => {
        this.loading.company = false;
      })
    )
    .subscribe((res) => {
      this.company = res;
    })
    this.getAllVehiclesByCompanyId();
  }

  filterType(event: any){
    if(event.target.value === 'all') this.getAllVehiclesByCompanyId();
    else this.getAllVehiclesByCompanyId({type:event.target.value});
  }

  getAllVehiclesByCompanyId(queryParams?:{type: string}) {
    const query = queryParams ? queryParams : {type:''};
    this.loading.vehicles = true;
    this.apiService.getAllVehiclesByCompanyId(this.companyId, query)
    .pipe(
      finalize(() => {
        this.loading.vehicles = false;
      })
    )
    .subscribe((res) => {
      res.forEach((data) => {
        if (this.vehicleTypes.indexOf(data.type?.toLowerCase()) === -1) {
          this.vehicleTypes.push(data.type?.toLowerCase());
        }
        if (data.images) {
          data.images = data.images?.map((image)=> `${environment.baseUrl.slice(0, -1)}${image}`).reverse();
          if(data.images?.length === 0) data.images.push('/assets/images/no-image.jpeg');
        } else {
          data['images'] = [];
          data.images.push('/assets/images/no-image.jpeg');
        }
        
      })
      this.vehicleList = res;
    })
  }

}
