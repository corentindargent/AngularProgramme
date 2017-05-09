import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Tag } from './model';

@Injectable()
export class TagService {
  
   private tag : Tag;
   private baseUrl :string  = " http://indoor.traxxeo.com/service/tag"; 
 
  constructor(private http : Http) { }
  
    static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  
	  
  }
  
  addTag(tag : Tag){
	 console.log("add obj");
	 console.log(tag);
      /*Create BUIDLING*/	 
	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
    let options  = new RequestOptions({ headers: headers });	
	
	let body =
	{
		"fixed":tag.fixed,"x":tag.x,"y":tag.y,"z":tag.z,"reference":tag.reference,"id_object":tag.id_object,"mac":tag.mac

	};
	
	return this.http.post(this.baseUrl+'/add',body,options)
		.map((response) => {
			console.log('update result received in service:');			
			return response/* .json() */;
		})
	    .catch(TagService.handleError);
	}
	
	getAllTag(){
		let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); 
        let options  = new RequestOptions({ headers: headers });
		
		return this.http.get(this.baseUrl+"/listAll",options)
		  .map((res:Response) => res.json())
	      .map((tags:Array<any>) => {
		  let result:Array<Tag> = [];			 
		  if(tags)
		  {
				tags.forEach( (tag) =>{
					console.log(tag);
					var newTag = new Tag();					
					 newTag.reference = tag.reference;					 
					 newTag.id_object = tag.object_id;
					 newTag.mac = tag.mac;
					 newTag.id_tag = tag.tag_id;
					 newTag.fixed = tag.fixed;
					result.push(newTag);
				});
		  }
			  return result;
	      
		})
		.catch(TagService.handleError);
	}
	
	updateTag(tag : Tag){
	 console.log("updatye");
	 console.log(tag);
      /*Create BUIDLING*/	 
	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
    let options  = new RequestOptions({ headers: headers });	
	
	let body =
	{
		"fixed":tag.fixed,"x":tag.x,"y":tag.y,"z":tag.z,"reference":tag.reference,"id_object":tag.id_object,"mac":tag.mac,"tag_id":tag.id_tag

	};
	
	return this.http.post(this.baseUrl+'/update',body,options)
		.map((response) => {
			console.log('update result received in service:');			
			return response/* .json() */;
		})
	    .catch(TagService.handleError);
	}
  
  

}
