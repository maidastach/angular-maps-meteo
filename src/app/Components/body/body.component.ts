import { Component, OnInit } from '@angular/core';
import { MapService } from 'src/app/Services/map/map.service';

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {
  weather!: any
  weatherLoading!: boolean

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    this.mapService.weather.subscribe(weather => this.weather = weather)
    this.mapService.weatherLoading.subscribe(weatherLoading => this.weatherLoading = weatherLoading)
  }

}
