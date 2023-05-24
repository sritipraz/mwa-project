import { IBooking } from './interface/booking';
import { IVehicle, IAddVehicle } from './interface/vehicle';
import { ILogin } from './interface/login';
import { environment } from '../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { ISignup } from './interface/signup';
import { ICompany , IAddCompany} from './interface/company';
import { map } from 'rxjs';
import { UserServiceService } from './user-service.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  http = inject(HttpClient);

  userState = inject(UserServiceService);

  signup(data: ISignup) {
    return this.http.post<{ success: boolean, results: string }>(environment.baseUrl + "users/signup", data);
  }

  addCompany(data: IAddCompany) {
    return this.http.post<{ success: boolean, results: string }>(environment.baseUrl + "companies", data);
  }

  //companies
  getAllCompanies(queryParms?: { name?: string,lng?:number|null,lat?:number|null }) {
    let queryParamPath = "";
    if (queryParms?.lng && queryParms?.lat) {
      queryParamPath = `?lng=${queryParms.lng}&lat=${queryParms.lat}`;
    } else if(queryParms?.name) {
      queryParamPath = `?name=${queryParms?.name}`;
    }
    return this.http.get<{ success: boolean, results: ICompany[] }>(environment.baseUrl + "companies"+queryParamPath)
      .pipe(
        map((res) => res.results)
      );
  }

  //company by id
  getCompanyById(id: string) {
    return this.http.get<{ success: boolean, results: ICompany }>(environment.baseUrl + "companies/" + id)
      .pipe(
        map((res) => res.results)
      );
  }
  //vehicles by company id
  getAllVehiclesByCompanyId(companyId: string, queryParams?:{type: string}) {
    const queryParamPath = queryParams?.type ? `?type=${queryParams.type}`: '';
    return this.http.get<{ success: boolean, results: IVehicle[] }>(`${environment.baseUrl}companies/${companyId}/vehicles${queryParamPath}`)
      .pipe(
        map((res) => res.results)
      );
  }
  login(data: ILogin) {
    return this.http.post<{ success: boolean, results: string }>(environment.baseUrl + "users/" + "login", data);
  }

  //dashboard
  getCompanyCount() {
    return this.http.get<{ success: boolean, results: Number }>(`${environment.baseUrl}companies/count`)
      .pipe(
        map((res) => res.results)
      );
  }
  getVehicleByCompanyAndTypeCount() {
    return this.http.get<{ success: boolean, results: Array<{ _id: string, company: string, type: string, count: Number }> }>(`${environment.baseUrl}companies/vehicles/count`)
      .pipe(
        map((res) => res.results)
      );
  }

  addVehicle(company_id: string, data: IAddVehicle) {
    return this.http.post<{ success: boolean, results: IVehicle }>(`${environment.baseUrl}companies/${company_id}/vehicles`, data);
  }

  editCompany(data: ICompany,id: string) {
    return this.http.put<{ success: boolean, results: string }>(environment.baseUrl + "companies/" + id, data);
}
  //vehicle detail
  getVehicleById(companyId: string, vehicleId: string) {
    return this.http.get<{ success: boolean, results: {vehicles:IVehicle[]} }>(`${environment.baseUrl}companies/${companyId}/vehicles/${vehicleId}`)
      .pipe(
        map((res) => res.results)
      );

  };

  uploadImage(company_id:string,vehicle_id:string,data:FormData){
    return this.http.post<{ success: boolean, results: any }>(`${environment.baseUrl}companies/${company_id}/vehicles/${vehicle_id}/upload`, data);
  }

  //vehicle delete
  removeVehicleById(companyId: string, vehicleId: string) {
    return this.http.delete<{ success: boolean, results: {acknowledged: Boolean, matchedCount: Number,modifiedCount: Number,upsertedCount:Number} }>(`${environment.baseUrl}companies/${companyId}/vehicles/${vehicleId}`)
      .pipe(
        map((res) => res.results)
      );
  }

   //company delete
   removeCompanyById(companyId: string) {
    return this.http.delete<{ success: boolean, results: {acknowledged: Boolean, matchedCount: Number,modifiedCount: Number,upsertedCount:Number} }>(`${environment.baseUrl}companies/${companyId}`)
      .pipe(
        map((res) => res.results)
      );
  }

  bookVehicle(companyId: string, vehicleId: string, data: IBooking) {
    return this.http.post<{ success: boolean, results: any }>(`${environment.baseUrl}companies/${companyId}/vehicles/${vehicleId}/appointments`, data);
  }
  //vehicle edit
  editVehicle(data: IVehicle,company_id: string,vehicle_id: string) {
    return this.http.put<{ success: boolean, results: string }>(`${environment.baseUrl}companies/${company_id}/vehicles/${vehicle_id}`, data);
}

}

