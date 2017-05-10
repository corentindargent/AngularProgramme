import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params }  from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {ObjetService} from '../objet.service';
import {Object} from '../model';


@Component({
  selector: 'app-object-detail',
  templateUrl: './object-detail.component.html',
  styleUrls: ['./object-detail.component.css']
})
export class ObjectDetailComponent implements OnInit {


  private objectId : number;
  
  constructor(private route : ActivatedRoute, private objectService : ObjetService) { }

  ngOnInit() {
	   this.route.params.forEach((params :Params) => {
		this.objectId = +params['objectId'];	
console.log(this.objectId);		
	 });
  }

}
