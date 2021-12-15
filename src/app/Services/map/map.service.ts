import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DirectionsService } from './directions.service';
declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class MapService {
  map!: any
  service!: any;
  infowindow!: any;
  location!: any
  placeSource = new BehaviorSubject<string>('')
  place = this.placeSource.asObservable();
  autocomplete!: any;
  markers: any[] = []


  constructor(private directionsService: DirectionsService) { }

  initMap(lat: number = -33.867, lng: number = 151.195): void //default view on Sydney
  {
    this.location = new google.maps.LatLng(lat, lng);
    this.infowindow = new google.maps.InfoWindow();

    this.map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        { center: this.location, zoom: 15, mapTypeControl: false }
    )

    const addMarker = (position: any) => 
    {
      this.placeSource.next('User Marker')
      if(this.markers.length === 2)
      {
        for (let i = 0; i < this.markers.length; i++) 
          this.markers[i].setMap(null);
        this.markers = [];
      }

      const marker = new google.maps.Marker(
        {
          position,
          map: this.map,
          title: 'User Marker',
          label: this.markers.length === 1 ? 'B' : 'A',
        }
      );
      
      this.markers.push(marker);

      this.map.setCenter(position)
        
      google.maps.event.addListener(
        marker, 
        "click", 
        () => 
        {
          this.infowindow.setContent(marker.getTitle() || "");
          this.infowindow.open(this.map);
        }
      );
    }
      
      this.map.addListener(
        "dblclick", 
        (event: any) => addMarker(event.latLng)
      );
  
  }

  autoComplete(): void
  {
    this.autocomplete = new google.maps.places.Autocomplete(
      document.getElementById('autocomplete'),
      {
        fields: ['place_id', 'geometry', 'name', 'address_components'],
        componentRestrictions: { country: "au" },
      }
    )

    const createMarker = (place: any): void =>
    {
      if(!place.geometry || !place.geometry.location)
        return

      if(this.markers.length === 2)
      {
        for (let i = 0; i < this.markers.length; i++) 
          this.markers[i].setMap(null);
        this.markers = [];
      }

      const marker = new google.maps.Marker(
        {
          map: this.map,
          position: place.geometry.location,
          label: this.markers.length === 1 ? 'B' : 'A',
        }
      )
      
      this.markers.push(marker);



      this.map.setCenter(place.geometry.location)

      google.maps.event.addListener(
        marker, 
        "click", 
        () => 
        {
          this.infowindow.setContent(place.name || "");
          this.infowindow.open(this.map);
        }
      );
    }

    const onPlaceChanged = () =>
    {
      const place = this.autocomplete.getPlace()

      if(!place.geometry)
        (document.getElementById('autocomplete') as HTMLInputElement).placeholder = 'Search For A place'
      else
      {
        this.placeSource.next(place.name)
        createMarker(place)
      }
    }

    this.autocomplete.addListener('place_changed', onPlaceChanged)
  }

  
}
