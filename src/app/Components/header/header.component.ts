import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapService } from 'src/app/Services/map/map.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  placeToSearch: FormControl = new FormControl('') 
  currentLocation!: string

  constructor(private mapService: MapService) { }

  ngOnInit(): void {
    console.log(this.placeToSearch);

    this.mapService.place.subscribe(place => this.currentLocation = place)


    
  }

  searchPlace(event: any): void
  {
    console.log(event);
    
  }

  autoComplete()
  {
    this.mapService.autoComplete()
  }
}
