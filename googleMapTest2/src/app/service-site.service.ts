import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Site,Building,Object } from './model';

@Injectable()
export class SiteService {

 
  public site :Site;
  private baseUrl :string  = "http://indoor.traxxeo.com/service/site";  
  
  //APRES L'appel A  UN SERVICE CELUI-CI RETURN STRING ET NON PLUS UN JSON
  
  constructor(private http : Http) {
	}
	
  /* SI envoie object site au lieu id (acces page object site)
  private siteSendToOtherComponent : Site;
    getSiteSend(){
		return this.siteSendToOtherComponent;
	}
	
	setSiteSend(site :Site){
		this.siteSendToOtherComponent = site;
	} */
 
	static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  
	  
	}
   
  constructBuildingOfSite(siteId : number,buildingOfSite:Array<any>):Array<Building>
  {
	 let result : Array<Building> = [];
	buildingOfSite.forEach( (aBuildOfSite) =>{
					
					var newBuilding = new Building();					
						newBuilding.reference =  aBuildOfSite.buildingRef;
						newBuilding.building_id  = aBuildOfSite.buildingId;						
						newBuilding.polygon = this.convertStringPolygon(aBuildOfSite.buildingPolygon);
						newBuilding.site_id = siteId;
											
						
					result.push(newBuilding);
				});
	 
	return  result;	  
  }
  

   getSiteAndBuild()
   {
	   let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
       let options  = new RequestOptions({ headers: headers });
		
	  return this.http.get(this.baseUrl+"/listAll",options)
	   .map((res:Response) => res.json())
	   .map((sites:Array<any>) => {
		  let result:Array<Site> = [];
		  if(sites)
		  {
				sites.forEach( (site) =>{
					
					var newSite = new Site();
					
						newSite.site_id = site.siteId;
						newSite.reference =  site.siteRef;
						newSite.latitude = site.latitude;
						newSite.longitude  = site.longitude;
						newSite.polygon = this.convertStringPolygon(site.sitePolygon);	
						
						if(site.buildings[0])	
						{
							newSite.listBuidling = this.constructBuildingOfSite(site.siteId,site.buildings);							
						}
						else
						{
							newSite.listBuidling =site.buildings;
						}
					result.push(newSite);
				});
		  }  
		  return result;
	    }	 //map array
		
	  ) 
	  .catch(SiteService.handleError);	   
	   
   }
  
  /*VERIFIER JSON CREER
  */
  
  convertStringPolygon(polygon:string):Array<any> 
  {
	  var listCoord = polygon.match(/[0-9]+.[0-9]+,[0-9]+.[0-9]+/g);
      var tabCoordPolygon = new Array(); 
	  
		for(let i =0 ;i < listCoord.length ; i++)
		{
			let obj = {};
			var finalRes = listCoord[i].match(/[0-9]+.[0-9]+/g);
			
			obj["lat"] = parseFloat(finalRes[0]);
			obj["lng"] = parseFloat(finalRes[1]);
			tabCoordPolygon.push(obj);
		}
		
		return	 tabCoordPolygon;	
  }
  
  createJsonPolygon(listPoints : Array<any>, addNewInstance : boolean):Array<any>
  { 
    var tabJson = [];
	for (var i = 0; i < listPoints.length; i++) {
		var xy = listPoints[i];		
		tabJson.push({'x': xy.lat(),'y': xy.lng()});				
	}
		return tabJson;
  }
  
  
	addSite(site: any){
	  
	/*DATA SEND */

	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
	let options  = new RequestOptions({ headers: headers });	

	var cartesianPoints = [];
		cartesianPoints = this.createJsonPolygon(site.polygon,true);
		
	var firstPoint =  site.polygon[0];

	let body = 
	{   
		"address":site.address,"altitude":4.456,"reference":site.reference,"land_number":site.land_number,
		"longitude":firstPoint.lng(),"cartesian":{"points":cartesianPoints},"latitude":firstPoint.lat()
	};

	console.log(JSON.stringify(body));	

	return this.http.post(this.baseUrl+'/add',body,options)
		.map((response) => {
			
			console.log('update result received in service:');
			
			return response/* .json() */;
			//return Observable.of(worker);
		   })
	.catch(SiteService.handleError);		

	}
	
	
	updateSite(site: Site)
	{
		console.log(site);
		console.log(site.polygon[0]);
		let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
		let options  = new RequestOptions({ headers: headers });
        
		var cartesianPoints = [];
		cartesianPoints = this.createJsonPolygon(site.polygon,false);
		
		var firstPoint =  site.polygon[0];
		
		
        let body = {
			"site_id" : site.site_id,"address":site.address,"altitude":4.456,"reference":site.reference,"land_number":site.land_number,
			"longitude":firstPoint.lng,"cartesian":{"points":cartesianPoints},"latitude":firstPoint.lat
				
		}
		console.log(JSON.stringify(body));

		 /*PUT PASSE PAS BLOQUER */
		return this.http.post(this.baseUrl+'/update',body,options)
			.map((response) => {
				console.log('update result received in service:');
			
			return response;
			})
			.catch(SiteService.handleError);		
	}
	
	
	getAllObject(siteId : number)
	{
		let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); 
        let options  = new RequestOptions({ headers: headers });
		
		
		return this.http.get(this.baseUrl+"/object?siteId="+siteId,options)
		  .map((res:Response) => res.json())
	      .map((objects:Array<any>) => {
		  let result:Array<Object> = [];			 
		  if(objects)
		  {
				objects.forEach( (obj) =>{
					
					var object = new Object();					
					 object.reference = obj.objectRef;
					 object.spaceId = obj.spaceId;
					 object.id_object = obj.objectId;					
					result.push(object);
				});
		  }
			  return result;
	      
		})
		.catch(SiteService.handleError);	  
	
	}
}