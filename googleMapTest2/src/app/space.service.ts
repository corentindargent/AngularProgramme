import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Space } from './model';
@Injectable()
export class SpaceService {

  private baseUrl: string = "http://indoor.traxxeo.com/service/space";  

  constructor(private http :Http) { }
  
  
  static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  
	  
  }
  
  addSite(space: any){
	  
	
	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
	let options  = new RequestOptions({ headers: headers });	


//body ok -> VERIF SI POINTS CARTESAIN PASSE
	let body = 
	{   
		"reference":space.reference,"id_floor":space.id_floor,
		"x":space.x,"cartesian":{"points":space.polygon},"y":space.y,"z":space.z
	};

	console.log(JSON.stringify(body));	

	return this.http.post(this.baseUrl+'/add',body,options)
		.map((response) => {
			
			console.log('update result received in service:');
			
			return response.json();
			//return Observable.of(worker);
		   })
	.catch(SpaceService.handleError);		

	}
	
	
	updateSpace(space: Space)
	{
		let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
		let options  = new RequestOptions({ headers: headers });
        
		
		
		//body ok -> VERIF SI POINTS CARTESAIN PASSE
        let body = 
		{   
			"reference":space.reference,"id_floor":space.id_floor,
			"x":space.x,"cartesian":{"points":space.polygon},"y":space.y,"z":space.z
		};
		
		 /*PUT PASSE PAS ; BLOQUER */
		return this.http.post(this.baseUrl+'/update',body,options)
			.map((response) => {
				console.log('update result received in service:');
			
			return response.json();
			})
			.catch(SpaceService.handleError);		
	}
  

}
