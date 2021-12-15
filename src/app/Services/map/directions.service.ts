import { Injectable } from '@angular/core';
declare const google: any

@Injectable({
  providedIn: 'root'
})
export class DirectionsService {

  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  constructor() { }

  getDirections(start: any, end: any)
  {
    

  }
}
