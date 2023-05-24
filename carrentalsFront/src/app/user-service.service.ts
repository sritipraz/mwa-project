import { Injectable } from '@angular/core';
import IUser from './interface/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserServiceService {
  user:IUser={
    jwt: '',
    user_id: '',
    email: '',
    fullname: '',
    isAdmin: false,
    isVerified: false
  }
  public _userState: BehaviorSubject<IUser> =new BehaviorSubject(this.user)

  getUserState$ = this._userState.asObservable();
  

  getUserState() {
    return this._userState.getValue();
  }

  setUserState(newState:IUser){
    this._userState.next(newState)
  }
  
   logout() {
    localStorage.removeItem('USER_STATE');
    this.setUserState(this.user);
  }
}
