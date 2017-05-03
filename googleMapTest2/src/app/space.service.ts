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
  
  addSpace(space: any){
	  
	
	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
	let options  = new RequestOptions({ headers: headers });	
console.log(space.polygon);

    var cartesianPoints = [];	
	cartesianPoints = this.constructJsonPolygon(space.polygon,true);

	let body = 
	{   
		"reference":space.reference,"id_floor":space.id_floor,
		"x":space.x,"cartesian":{"points":cartesianPoints},"y":space.y,"z":space.z
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
        
		console.log(space.polygon[0]);
		
		var cartesianPoints = [];	
		cartesianPoints = this.constructJsonPolygon(space.polygon,false);
		
		//body ok -> VERIF SI POINTS CARTESAIN PASSE
        let body = 
		{   
			"reference":space.reference,"id_floor":space.id_floor,"space_id":space.id_space,
			"x":space.x,"cartesian":{"points":cartesianPoints},"y":space.y,"z":space.z
		};
		console.log(JSON.stringify(body));
		 /*PUT PASSE PAS ; BLOQUER */
		return this.http.post(this.baseUrl+'/update',body,options)
			.map((response) => {
				console.log('update result received in service:');
			
			return response.json();
			})
			.catch(SpaceService.handleError);		
	}
	
	
	
	//boolean permet de savoir distinguer l'ajout  de la modification car le polygon est "stockee" de manière différente selon "l'action"
   constructJsonPolygon(listPoints : Array<any>,addNewInstance : boolean):Array<any>   
   {
		 var tabJson = []; 
		 for (var i = 0; i < listPoints.length; i++) {
			 var xy = listPoints[i];
			 if(addNewInstance){

				tabJson.push({'x': xy[0],'y': xy[1]});
			 }
			 else{
				 tabJson.push({'x': xy.x,'y': xy.y});
			 }
		}
		return tabJson;	  
   }
  

}
