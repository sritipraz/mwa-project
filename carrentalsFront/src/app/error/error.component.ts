import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styles:[]
})
export class ErrorComponent {
msg="Token Expired"
title: string = "Something's went wrong.";
showButton=true;
  
}
