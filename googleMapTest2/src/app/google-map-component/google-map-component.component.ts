import { Component,OnInit,ViewChild,ElementRef } from '@angular/core';
import { GMapService } from '../gmap-service.service';


@Component({
  selector: 'google-map-component',
  templateUrl: './google-map-component.component.html',   
  styleUrls: ['./google-map-component.component.css']
})
export class GoogleMapComponentComponent implements OnInit {

  @ViewChild('map') mapRef: ElementRef;

    constructor(private gmapService: GMapService) { }

    ngOnInit() {
      this.gmapService.initMap(this.mapRef.nativeElement, {
        center: {lat: 50.657361, lng: 4.626348},
        scrollwheel: true,
        zoom: 11
      });
    }

}
