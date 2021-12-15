import { AfterViewInit, Component } from '@angular/core';
import { MapService } from './Services/map/map.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements AfterViewInit {

  constructor(private mapService: MapService) { }

  ngAfterViewInit(): void {
    this.mapService.initMap()
    this.mapService.autoComplete()
  }

  title = 'stepinsigthInterview';


}
