import { Component, OnInit,Input } from '@angular/core';

import { Tag,Object } from '../model';
import {ObjetService} from '../objet.service';
import {TagService} from '../tag.service';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})


export class TagComponent implements OnInit {

  basicView : boolean = true;// html par defaut
  
  // var creation
  @Input() newTag : Tag;
  
  //var modification
  isUpdateTag : boolean;
  selectedTag : number;
  
  //Listing données
  objects_liste : Array<Object>;
  tag_listes : Array<Tag>;

  constructor(private tagService :TagService,private objetService :ObjetService) { }

  ngOnInit() {
	  this.newTag = new Tag();
	  
	  //get all objetc
	  this.objetService.getAllObjects()
	  .subscribe(
		(object : Array<Object>) => {
			this.objects_liste = object;
			console.log(this.objects_liste);
		},
		(err:any) => {console.error(err); console.log(err.body)}
	  );
	  
	  //get all tag
	  this.tagService.getAllTag()
	  .subscribe(
		(tag : Array<Tag>) => {
			this.tag_listes = tag;			
		},
		(err:any) => {console.error(err); console.log(err.body)}
	  );
  }
  
  confirmAddTag(){
	  this.tagService.addTag(this.newTag)
	  .subscribe(tag =>{
		  console.log('create new floor'+tag); 
		  this.newTag = new Tag();
		  },
		 (err:any) => console.error(err) 	  
	  );	 
	  
  }
  
  createTag(){
	  if(this.isUpdateTag){
		  this.isUpdateTag=false;
		  this.basicView=true;
	  }
	  this.newTag = new Tag();
  }
  
  updateTag(){
	  if(this.basicView){
		  this.isUpdateTag=true;
		  this.basicView=false;
	  }
	  this.newTag = new Tag();
  }
  
  
  onSelectTag(i : number)
  {	  
	  var tagSelected = this.tag_listes[i];
	  
	  //garnit variable de "formualire"
	  this.newTag.id_tag = tagSelected.id_tag;
	  this.newTag.reference = tagSelected.reference;
	  this.newTag.mac = tagSelected.mac;
	  this.newTag.id_object = tagSelected.id_object;
  }
  
  confirmUpdateTag(){
	  this.tagService.updateTag(this.newTag)
	  .subscribe(tag =>{
		  console.log('create new floor'+tag); 
		  },
		 (err:any) => console.error(err) 	  
	  );	  
  }

}
