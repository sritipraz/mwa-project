import { Component, inject } from '@angular/core';
import { ApiService } from '../../../api.service';
import { ICompany } from '../../../interface/company';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styles: [
  ]
})
export class CompanyListComponent {
  loading: boolean = false;
  apiService = inject(ApiService);
  companyList: ICompany[] = [];
  constructor() {
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
  removeCompany(company_id: string) {
    if(confirm("Are you sure to delete?")) {
      this.apiService.removeCompanyById(company_id).subscribe((res) => {
          this.companyList = this.companyList.filter(company => company._id !== company_id)
      })    
    }
  }

  clearFilter(): void{
    this.name = "";
     this.apiService.getAllCompanies().subscribe((res)=> {
      this.companyList = res ;
    })
  }
}
