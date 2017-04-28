import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { Reader } from './model';


@Injectable()
export class ReaderService {

  private baseUrl :string  = "http://indoor.traxxeo.com/service/reader";  
	 
  constructor(private http : Http) { }
  
  
    static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  
	  
  }
  
  /* {"z":3.456,"id_space":1,"fixed":true,"y":2.345,"mac":"Mac","reference":"Reader1","x":1.234} */
  
  addReader(reader: any){
	  
		/*DATA SEND */

		let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
		let options  = new RequestOptions({ headers: headers });	

		

	 
		let body = 
		{   
			"reference":reader.reference,"id_space":reader.id_space,
			"x":reader.x,"mac":reader.mac,"y":reader.y,"z":reader.z,"fixed":reader.fixed
		};

		console.log(JSON.stringify(body));	
		

		return this.http.post(this.baseUrl+'/add',body,options)
			.map((response) => {
				
				console.log('update result received in service:');
				
				return response.json();				
			})			   
		.catch(ReaderService.handleError);	

	}
  
  
  

}


