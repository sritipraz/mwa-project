import { MapService } from './../../map.service';
import { Component, inject } from '@angular/core';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-leaflet',
  templateUrl: './leaflet.component.html',
  styleUrls: ['./leaflet.component.css']
})
export class LeafletComponent {
  mapService = inject(MapService);

  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];

  options:any = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 16,
    center: { lat: 41.0092559, lng: -91.966387}
  }

  initMarkers() {
    const initialMarkers = [
      {
        position: { lat: 41.0099412, lng: -91.9661548 },
        draggable: true
      },
      {
        position: { lat: 41.0099412, lng: -91.9661548 },
        draggable: false
      },
      {
        position: { lat: 41.0111153, lng: -91.9635252},
        draggable: true
      }
    ];


    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${data.position.lat},  ${data.position.lng}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
      .on('click', (event) => this.markerClicked(event, index))
      .on('dragend', (event) => this.markerDragEnd(event, index));
  }

  onMapReady($event: any) {
    this.map = $event;
    this.initMarkers();
  }

  mapClicked($event: any) {
    this.mapService.addData($event.latlng.lat, $event.latlng.lng);
  }

  markerClicked($event: any, index: number) {
    this.mapService.addData($event.latlng.lat, $event.latlng.lng);
  }

  markerDragEnd($event: any, index: number) {
    console.log($event.target.getLatLng());
  } 

}
