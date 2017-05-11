import { Component, OnInit,ViewChild,Input } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {SiteService} from '../service-site.service';
import {ObjetService} from '../objet.service';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';


import {Object} from '../model';
import {OrderByPipe} from '../custom-pipe';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css'],   
})
export class ObjectComponent implements OnInit {

  
  @ViewChild('modal')  modal: ModalComponent;
  
  @ViewChild('modalUpdate')  modalUpdate: ModalComponent;
  private siteId : number;
  @Input() critereRecherche : any;
  
  //var ajout
  @Input()  newObject : Object;
  
  
  //var update	
    @Input()  updateObject : Object;
	private selectedObject : any;
	private lastSelected : number;
  
  
  //VARIABLES DE TRI     
	isDesc: boolean ; //ordre (de)croisssant 
	column: string;   // colonne  subit le tri
	direction: number; 
   
  //Liste de données
	objects_listes : Array<Object> = new Array();  
  
  /* TABLEAU DE TEST
  
  tabHeading = ["#","Details objet","Reference Objet","Objet","Date Detection","Pièce localisé","Etage","Batiment","Site affecté"];  
  
  listObject : Array<any> =  [
			{spaceId:0 ,reference:"Sac a dos",id_object:10},
			{spaceId:1,reference:"Cartable",id_object:11},
			{spaceId:2,reference:"Bonbon",id_object:11}];
   */

  constructor(private route : ActivatedRoute, private siteService: SiteService, private objectService : ObjetService) { }

  ngOnInit() {
	 this.route.params.forEach((params :Params) => {
		this.siteId = +params['siteId'];		 
	 });
	
		this.initPage();
	 
  }
  
 
  initPage(){
	  
	  this.critereRecherche = "";
	  this.newObject = new Object(); 
	  this.updateObject = new Object(); 
	  
	// SI SITEDID TRUE LIST OBJECT D'UN SITE DONNE
	if(this.siteId){ 
		console.log(this.siteId); 
	  this.siteService.getAllObject(this.siteId)
	  .subscribe(
		(object : Array<Object>) => {			
			this.objects_listes = object;
		},
		(err:any) => {console.error(err); console.log(err.body)}
	  );
	}
	else//lising de tous les object
	{		
		this.objectService.getAllObjects()
		.subscribe(
			(object : Array<Object>) => {			
			this.objects_listes = object;			
		},
		(err:any) => {console.error(err); console.log(err.body)}
	  );  
				
	}
  }
    
  //methode permet de trier table
 sort(property){
    this.isDesc = !this.isDesc; //change the direction    
    this.column = property;
    this.direction = this.isDesc ? 1 : -1;
  };
  
 confirmAddObjet(){
	 this.modal.close();
	 console.log("Ok");
	 console.log(this.newObject);
	  this.objectService.addObject(this.newObject).subscribe(
			obj => {console.log('create new object'+obj);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  );  
 }
 
 confirmUpdateObjet(){
	 console.log("Ok");
	 console.log(this.newObject);
	 this.modalUpdate.close();
	  this.objectService.updateObject(this.updateObject).subscribe(
			obj => {console.log('create new object'+obj);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  );  
	  
 }
 
  selectingObject(i:number){
	  
	  if(this.lastSelected == i){//si le nouveau selectionne == dernier selcetionne 
		  this.lastSelected = null;
		  this.selectedObject = null;
	  }
	  else
	  {
		  this.lastSelected = i;
		  this.selectedObject = this.objects_listes[i];
		  this.updateObject.reference = this.objects_listes[i].reference;	  
		  this.updateObject.id_object = this.objects_listes[i].id_object;	
	  }
  }

  searchObject(){
	  console.log(this.critereRecherche);
	  
	  if(this.critereRecherche){
	  this.objectService.searchObject(this.critereRecherche)
	  .subscribe(
		(object : Array<Object>) => {
			console.log(object);		
			
			if(object){

				this.objects_listes = object;
			}
		},
		(err:any) => {console.error(); alert("Aucune objet trouvé")}
	  );
	  this.critereRecherche = "";	
	}
	
  }
  
  
   
}
