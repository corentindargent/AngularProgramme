import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { Site,Building } from './model';

@Injectable()
export class SiteService {

  public site :Site;
  private baseUrl :string  = "http://indoor.traxxeo.com/service";  
  
  
  
  constructor(private http : Http) {
	}
  
  
 
	static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  
	  
  }
   
  constructBuildingOfSite(siteId : number,buildingOfSite:Array<any>):Array<Building>
  {
	 let result : Array<Building> = [];
	console.log(siteId);
	buildingOfSite.forEach( (aBuildOfSite) =>{
					
					var newBuilding = new Building();					
						newBuilding.reference =  aBuildOfSite.buildingRef;
						newBuilding.building_id  = aBuildOfSite.buildingId;						
						newBuilding.polygon = this.convertStringPolygon(aBuildOfSite.buildingPolygon);
						newBuilding.site_id = siteId;
											
						console.log(newBuilding);
					result.push(newBuilding);
				});
	 
	return  result;	  
  }
  

   getSiteAndBuild()
   {
	   let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
       let options  = new RequestOptions({ headers: headers });
		
	  return this.http.get("http://indoor.traxxeo.com/service/site/listAll",options)
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
												
						console.log(newSite.listBuidling);
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
	  /* console.log("POLYGON");
	  console.log(polygon);
	  console.log(polygon.match(/[0-9]+.[0-9]+/g)); */
	  
	  var listCoord = polygon.match(/[0-9]+.[0-9]+,[0-9]+.[0-9]+/g);
      var tabCoordPolygon = new Array(); 
	  
		for(let i =0 ;i < listCoord.length ; i++)
		{
			let obj = {};
			var finalRes = listCoord[i].match(/[0-9]+.[0-9]+/g);
			
			/* console.log("x:"+finalRes[0]+" y:"+finalRes[1]);			
			console.log("lat:"+finalRes[0]+"\n");
			console.log("lng:"+finalRes[1]+"\n");
			console.log("\n\n"); */
			
			obj["lat"] = parseFloat(finalRes[0]);
			obj["lng"] = parseFloat(finalRes[1]);
			tabCoordPolygon.push(obj);
		}
		
		return	 tabCoordPolygon;	
  }
  
  createJsonPolygon(listPoints : Array<any>):Array<any>
  { 
    var tabJson = [];
	for (var i = 0; i < listPoints.length; i++) {
				var xy = listPoints[i];
				tabJson.push({'x': xy.lat(),'y': xy.lng()});
	}
		return tabJson;
  }
  
  addBuilding(building : any){
	 
      /*Create BUIDLING*/	 
	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
    let options  = new RequestOptions({ headers: headers });	
	
	var cartesianPoints = [];	
		cartesianPoints = this.createJsonPolygon(building.polygon);
	var firstPoint =  building.polygon[0];	
	
	let body =
	{
		"orientation":4.567,"altitude":4.456,"reference":building.reference,"id_site":building.site_id,
		"longitude":firstPoint.lng(),"cartesian":{"points":cartesianPoints},"latitude":firstPoint.lat()		
	};
	
	console.log(JSON.stringify(body));
	
	return this.http.post(this.baseUrl+'/building/add',body,options)
		.map((response) => {
			console.log('update result received in service:');			
			return response.json();
		})
	    .catch(SiteService.handleError);
	}
  
  

  
    updateBuilding(building : any){
	 
      /*Create BUIDLING*/	 
	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
    let options  = new RequestOptions({ headers: headers });	
	
	var cartesianPoints = [];	
		cartesianPoints = this.createJsonPolygon(building.polygon);
		console.log(building.polygon[0]);
	var firstPoint =  building.polygon[0];	
	
	let body =
	{
		"orientation":4.567,"altitude":4.456,"reference":building.reference,"id_site":building.site_id,
		"longitude":firstPoint.lng,"cartesian":{"points":cartesianPoints},"latitude":firstPoint.lat		
	};
	
	console.log(JSON.stringify(body));
	 /*PUT PASSE PAS BLOQUER */
	return this.http.post(this.baseUrl+'/building/update',body,options)
		.map((response) => {
			console.log('update result received in service:');			
			return response.json();
		})
	    .catch(SiteService.handleError);
	}
	
	
  
	addSite(site: any){
	  
	/*DATA SEND */

	let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
	let options  = new RequestOptions({ headers: headers });	

	var cartesianPoints = [];
		cartesianPoints = this.createJsonPolygon(site.polygon);
		
	var firstPoint =  site.polygon[0];

	let body = 
	{   
		"address":site.address,"altitude":4.456,"reference":site.reference,"land_number":site.land_number,
		"longitude":firstPoint.lng(),"cartesian":{"points":cartesianPoints},"latitude":firstPoint.lat()
	};

	console.log(JSON.stringify(body));	

	return this.http.post(this.baseUrl+'/site/add',body,options)
		.map((response) => {
			
			console.log('update result received in service:');
			
			return response.json();
			//return Observable.of(worker);
		   })
	.catch(SiteService.handleError);		

	}
	
	
	updateSite(site: Site)
	{
		let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
		let options  = new RequestOptions({ headers: headers });
        
		var cartesianPoints = [];
		cartesianPoints = this.createJsonPolygon(site.polygon);
		
		var firstPoint =  site.polygon[0];
		
		
        let body = {
			"site_id" : site.site_id,"address":site.address,"altitude":4.456,"reference":site.reference,"land_number":site.land_number,
			"longitude":firstPoint.lng(),"cartesian":{"points":cartesianPoints},"latitude":firstPoint.lat()
				
		}
		 /*PUT PASSE PAS BLOQUER */
		return this.http.post(this.baseUrl+'/site/update',body,options)
			.map((response) => {
				console.log('update result received in service:');
			
			return response.json();
			})
			.catch(SiteService.handleError);		
	}
	
}