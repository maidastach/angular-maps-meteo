import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  constructor(private http: HttpClient) { }


  getWeather(request: any): Observable<any>
  {
    return this.http.get<any>(`https://api.open-meteo.com/v1/forecast?latitude=${request.lat}&longitude=${request.lng}&hourly=precipitation,windspeed_180m&daily=temperature_2m_max,temperature_2m_min&timezone=Australia%2FSydney`)
  }
}
