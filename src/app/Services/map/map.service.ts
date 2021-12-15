import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { WeatherService } from '../weather/weather.service';
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

  temperature!: any;
  precipitation!: any;
  wind!: any;
  weather!: any;


  directionsService = new google.maps.DirectionsService();
  directionsRenderer = new google.maps.DirectionsRenderer();

  constructor(private weatherService: WeatherService) { }

  initMap(lat: number = -33.867, lng: number = 151.195): void //default view on Sydney
  {
    this.location = new google.maps.LatLng(lat, lng);
    this.infowindow = new google.maps.InfoWindow();

    this.map = new google.maps.Map(
        document.getElementById('map') as HTMLElement,
        { center: this.location, zoom: 15, mapTypeControl: false }
    )

    this.directionsRenderer.setMap(this.map)

    const addMarker = (position: any) => 
    {
      this.placeSource.next('User Marker')
      if(this.markers.length === 2)
      {
        this.directionsRenderer.setMap(null)
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

      this.weatherService
        .getWeather({ lat: position.lat(), lng: position.lng() })
          .subscribe(data => {console.log(data); this.weather = data })
        
      google.maps.event.addListener(
        marker, 
        "click", 
        () => 
        {
          this.infowindow.setContent(marker.getTitle() || "");
          this.infowindow.open(this.map);
        }
      );
      if(this.markers.length === 2)
        this.calcRoute(this.markers[0], this.markers[1])
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
        this.directionsRenderer.setMap(null)
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

      this.weatherService
        .getWeather({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() })
          .subscribe(data => {console.log(data); this.weather = data })

      google.maps.event.addListener(
        marker, 
        "click", 
        () => 
        {
          this.infowindow.setContent(place.name || "");
          this.infowindow.open(this.map);
        }
      );

      if(this.markers.length === 2)
      {
        this.calcRoute(this.markers[0], this.markers[1])

      }
        
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

  calcRoute(start: any, end: any): void {
    this.directionsRenderer.setMap(this.map)

    const selectedMode = 'DRIVING';
    const request = {
        origin: new google.maps.LatLng(start.position.lat(), start.position.lng()),
        destination: new google.maps.LatLng(end.position.lat(), end.position.lng()),
        travelMode: google.maps.TravelMode[selectedMode]
    };
    this.directionsService.route(
      request, 
      (response: any, status: any) =>
      {
        if (status == 'OK')
          this.directionsRenderer.setDirections(response);
          console.log(response);
          
        
      }
    );

    console.log(start, end);
    
  }
  

  
}
