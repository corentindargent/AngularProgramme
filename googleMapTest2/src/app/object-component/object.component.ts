import { Component, OnInit,ViewChild,Input } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';

import {SiteService} from '../service-site.service';
import {ObjetService} from '../objet.service';

import { NguiMessagePopupComponent, NguiPopupComponent} from '@ngui/popup';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';


import {Object} from '../model';

@Component({
  selector: 'app-object',
  templateUrl: './object.component.html',
  styleUrls: ['./object.component.css'],
})
export class ObjectComponent implements OnInit {

  
  @ViewChild(NguiPopupComponent) popup: NguiPopupComponent;  
  @ViewChild('modal')  modal: ModalComponent;
  
  @ViewChild('modal')  modalUpdate: ModalComponent;
  private siteId : number;
  
  //var ajout
  @Input()  newObject : Object;
  
  
  //var update
  private mouse_hover : boolean;
  private selectedObject : any;
  
  
  
  
  //Liste de données
  objects_listes : Array<Object>;

  listObject : Array<any> =  [
					{spaceId:0 ,reference:"Sac a dos",id_object:10},
						{spaceId:1,reference:"Cartable",id_object:11},
							{spaceId:2,reference:"Bonbon",id_object:11}
								];

  constructor(private route : ActivatedRoute, private siteService: SiteService, private objectService : ObjetService) { }

  ngOnInit() {
	 this.route.params.forEach((params :Params) => {
		this.siteId = +params['siteId'];		 
	 });
	 this.initPage();
  }
  
 
  initPage(){
	  console.log(this.siteId);
	  this.newObject = new Object(); 
	  this.siteService.getAllObject(this.siteId)
	  .subscribe(
		(object : Array<Object>) => {
			this.objects_listes = object;
		},
		(err:any) => {console.error(err); console.log(err.body)}
	  );
  }
  
    /*Method fenetre pop-up*/
  openPopup() {
      this.popup.open(NguiMessagePopupComponent, {
        title: 'Creation objet',
        message: 'My Message'
      })
  }
  
  /*Method fenetre Modal
  closeModal() {
        this.modal.close();
    }
     
    openModal() {
        this.modal.open();
    }
  
  
  //creation objet
  createObjet(){
	  this.openModal();
	  
  } */
  
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
	 this.modalUpdate.close();
	 console.log("Ok");
	 console.log(this.newObject);
	  this.objectService.updateObject(this.newObject).subscribe(
			obj => {console.log('create new object'+obj);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  );  
 }
 
  selectingObject(i:number){
	  console.log(i);
	  this.selectedObject = this.listObject[i];
	  this.newObject.reference = this.listObject[i].reference;	  
	  this.newObject.id_object = this.listObject[i].id_object;	
  }

}
