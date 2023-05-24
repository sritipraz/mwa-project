import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  data = {
    showMap: false,
    lng: 0,
    lat:0,
   }

  mapService = new BehaviorSubject(this.data);

  _mapService = this.mapService.asObservable();

  showMap() {
    this.data.showMap = true;
    this.mapService.next(this.data);
  }

  hideMap() {
    this.data.showMap = false;
    this.mapService.next(this.data);
  }

  addData(latitude:number,longitude:number) {
    this.data = { showMap:false, lng: longitude, lat: latitude }
    this.mapService.next(this.data);
  }
  constructor() { }
}
