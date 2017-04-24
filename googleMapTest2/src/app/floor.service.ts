import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Floor,Building } from './model';


@Injectable()
export class FloorService {

   private baseUrl :string  = "http://indoor.traxxeo.com/service/floor";   



  constructor(private http : Http) { }

  static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  
	  
  }
  
  
  addFloor(floor: any){
	  
	/*DATA SEND */

	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
	let options  = new RequestOptions({ headers: headers });	

	
//body ok -> VERIF SI POINTS CARTESAIN PASSE
	let body = 
	{   
		"reference":floor.reference,"order_number":floor.order_number,"id_building":floor.id_building,
		"x":floor.x,"cartesian":{"points":floor.polygon},"y":floor.y,"z":floor.z
	};

	console.log(JSON.stringify(body));	

	return this.http.post(this.baseUrl+'/add',body,options)
		.map((response) => {
			
			console.log('update result received in service:');
			
			return response.json();
			//return Observable.of(worker);
		   })
	.catch(FloorService.handleError);		

	}
  
  
}
