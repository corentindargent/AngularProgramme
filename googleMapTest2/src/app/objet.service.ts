import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Object } from './model';

@Injectable()
export class ObjetService {

  private object : Object;
  private baseUrl :string  = "http://indoor.traxxeo.com/service/object"; 
  
  constructor(private http : Http) { }
  
  static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  
	  
  }
   
   addObject(object : Object){
	 console.log("add obj");
	 console.log(object);
      /*Create BUIDLING*/	 
	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
    let options  = new RequestOptions({ headers: headers });	
	
	let body =
	{
		"reference":object.reference,
	};
	
	return this.http.post(this.baseUrl+'/add',body,options)
		.map((response) => {
			console.log('update result received in service:');			
			return response/* .json() */;
		})
	    .catch(ObjetService.handleError);
	}
    
	
	
	updateObject(object : Object){
	 
		  /*Create BUIDLING*/	 
		let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
		let options  = new RequestOptions({ headers: headers });	
		
		let body =
		{
			"reference":object.reference,"object_id":object.id_object,
		};
		
		return this.http.post(this.baseUrl+'/update',body,options)
			.map((response) => {
				console.log('update result received in service:');			
				return response/* .json() */;
			})
			.catch(ObjetService.handleError);
	}
	
	searchObject(objectRef : string){
		let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); 
        let options  = new RequestOptions({ headers: headers });
		
		
		
		return this.http.get(this.baseUrl+"/search?ref="+objectRef,options)
		  .map((res:Response) => res.json())
	      .map((obj:Array<any>) => {
		  let result:Object = new Object();
			  if(obj)
			  {
					result.reference = obj[0].objectRef;
					result.spaceRef = obj[0].spaceRef;
					result.id_object = obj[0].objectId;
											
					//console.log(result);							
			  }  
			  return result;
	      })
		 .catch(ObjetService.handleError);	   
	}
	
	getAllObjects(){
		
		let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); 
        let options  = new RequestOptions({ headers: headers });
		
		return this.http.get(this.baseUrl+"/listAll",options)
		  .map((res:Response) => res.json())
	      .map((objects:Array<any>) => {
		  let result:Array<Object> = [];			 
		  if(objects)
		  {
				objects.forEach( (obj) =>{					
					var object = new Object();					
					 object.reference = obj.reference;					 
					 object.id_object = obj.object_id;					
					result.push(object);
				});
		  }
			  return result;
	      
		})
		.catch(ObjetService.handleError);	 		
		
	}
	
	

}
