import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Location }                 from '@angular/common';

@Component({
  selector: 'building-component',
  templateUrl: './building-component.component.html',
  styleUrls: ['./building-component.component.css']
})
export class BuildingComponent implements OnInit {

  constructor(private route : ActivatedRoute, private location: Location) 
  {}

  ngOnInit() {
	 console.log(this.route.params);
  }
  
  
  // go bac retourner page precedente
  goBack(): void {
  this.location.back();
}

}
