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
   
  private siteId : number;
  @Input()  newObject : Object;
  
  //Liste de données
  objects_listes : Array<Object>;

  

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
  
  /*Method fenetre Modal*/
  closeModal() {
        this.modal.close();
    }
    
    openModal() {
        this.modal.open();
    }
  
  
  //creation objet
  createObjet(){
	  this.openModal();
	  
  }
  
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

}
