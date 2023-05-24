import { UserServiceService } from './../user-service.service';
import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import IUser from '../interface/user';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styles: [],
})
export class LayoutComponent {
  router=inject(Router);
  userService = inject(UserServiceService);
  userState!: IUser;
  ngOnInit() {
    this.userService.getUserState$.subscribe((state) => {
      this.userState = state;
    });
  }
  logout() {
    this.userService.logout();
    this.router.navigate(['']);
  }
}
