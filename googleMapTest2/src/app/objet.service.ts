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
	  return Observable.throw(error);
	 // return Observable.throw(error.json().error || 'Server error');	  
	  
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
		console.log("Deb search");
		console.log(objectRef);
		let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); 
        let options  = new RequestOptions({ headers: headers });
		
		
		
		return this.http.get(this.baseUrl+"/search?ref="+objectRef,options)
		  .map((res:Response) => res.json())
	      .map((obj:any) => {
		  let result:Object = new Object();
			  console.log(obj);
			  if(obj)
			  {
				  
									
					 result.reference = obj.objectRef;					 
					 result.id_object = obj.objectId;	
					

					  result.date_detection = obj.timestamp;
					  
					  result.spaceRef = obj.spaceRef;					  
					   result.buildId = obj.buildingId;
					   result.floorRef = obj.floorRef;
					   result.buildRef = obj.buildingRef;
					   result.siteRef = obj.siteRef;
											
					//console.log(result);							
			  } 
			  else{
				result = null;
			  }			  
			  console.log("end search");
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
console.log(obj);				
					var object = new Object();					
					 object.reference = obj.objectRef;					 
					 object.id_object = obj.objectId;	
					

					  object.date_detection = obj.timestamp;
					  
					  object.spaceRef = obj.spaceRef;					  
					   object.buildId = obj.buildingId;
					   object.floorRef = obj.floorRef;
					   object.buildRef = obj.buildingRef;
					   object.siteRef = obj.siteRef;
					 
					 
					result.push(object);
				});
		  }
			  return result;
	      
		})
		.catch(ObjetService.handleError);	 		
		
	}
	
	
	getObjectHistorical(objectId : number)
	{
		let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); 
        let options  = new RequestOptions({ headers: headers });
		
		/* return this.http.get(this.baseUrl+"/search?ref="+objectRef,options)
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
		 .catch(ObjetService.handleError); */
	}
	
	

}
