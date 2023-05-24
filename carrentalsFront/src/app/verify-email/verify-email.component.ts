import { Component } from '@angular/core';

@Component({
  selector: 'app-verify-email',
  template: `
   <app-info [showButton]="showButton" [title]="title" [message]="msg"></app-info>
  `,
  styles: [
  ]
})
export class VerifyEmailComponent {
  msg="Please check your mailbox to verify your account."
  title: string = "Verify Email";
  showButton=false;
}
