import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {SiteService} from '../service-site.service';
import {ObjetService} from '../objet.service';

import {Object} from '../model';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css']
})
export class ObjectComponent implements OnInit {

  private siteId : number;
  
  //Liste de données
  objects_listes : Array<Object>;

   // var creation
   newObjet : Object;

  constructor(private route : ActivatedRoute, private siteService: SiteService, private objectService : ObjetService) { }

  ngOnInit() {
	 this.route.params.forEach((params :Params) => {
		this.siteId = +params['siteId'];		 
	 });
	 this.initPage();
  }
  
  initPage(){
	  console.log(this.siteId);
	  this.siteService.getAllObject(this.siteId)
	  .subscribe(
		(object : Array<Object>) => {
			this.objects_listes = object;
		},
		(err:any) => {console.error(err); console.log(err.body)}
	  );
  }
  
  
  //creation objet
  createObjet(){
	  
	  
  }
  
 confirmAddObjet(){
	  this.objectService.addObject(this.newObjet).subscribe(
			obj => {console.log('create new object'+obj);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  );  
	  
  }

}
