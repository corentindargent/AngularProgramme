import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';



import { Site,Building,Floor,Space,Reader,Object } from './model';


@Injectable()
export class BuildingService {

	
  private baseUrl :string  = "http://indoor.traxxeo.com/service/building";  
  constructor(private http : Http) { }
  
  
  static handleError (error : Response){
	  console.log("Error catch");
	  console.error(error);
	  console.log(error.json());
	  return Observable.throw(error.json().error || 'Server error');	  	  
  }

  
/*CONVERSION STRING-"POLYGON" car lors du get on recoit la liste des points du polygon sous forme de string*/  
 convertStringPolygon(polygon:string):Array<any>{
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
  
/*PERMET DE CREER LE JSON CORRESPONDANT AU POLYGON DU BATIMENT*/
	 createJsonPolygon(listPoints : Array<any>):Array<any>{ 
		var tabJson = [];
		for (var i = 0; i < listPoints.length; i++) {
					var xy = listPoints[i];
					tabJson.push({'x': xy.lat(),'y': xy.lng()});
					 console.log( 'x :'+xy.lat()+", y :"+ xy.lng());
		}
			return tabJson;
	  }
  
/*NEW BUIDLING*/  

    addBuilding(building : Building){		 
			 
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
		
			
		return this.http.post(this.baseUrl+'/add',body,options)
		.map((response) => {
			console.log('update result received in service:');			
			return response/* .json() */;
		})
	    .catch(BuildingService.handleError);
	}
	
	
	
/*UPDATE BUIDLING*/		
	updateBuilding(building : Building){
	 
		let headers  = new Headers({ 'Content-Type': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
		let options  = new RequestOptions({ headers: headers });	
		
		var cartesianPoints = [];	
			cartesianPoints = this.createJsonPolygon(building.polygon);
			console.log(building.polygon[0]);
		var firstPoint =  building.polygon[0];	
		
		let body =
		{
			"orientation":4.567,"altitude":4.456,"reference":building.reference,"id_site":building.site_id,"building_id":building.building_id,
			"longitude":firstPoint.lng,"cartesian":{"points":cartesianPoints},"latitude":firstPoint.lat		
		};
		
		console.log(JSON.stringify(body));
		 /*PUT PASSE PAS BLOQUER */
		return this.http.post(this.baseUrl+'/update',body,options)
			.map((response) => {
				console.log('update result received in service:');			
				return response;
			})
			.catch(BuildingService.handleError);
	}
	/* .json() */
  
  
   getDataOfABuild(idBuilding: number)
   {
	   let headers  = new Headers({ 'Accept': 'application/json','Authorization':'Bearer token' }); // ... Set content type to JSON
       let options  = new RequestOptions({ headers: headers });
		
	  return this.http.get(this.baseUrl+"/listAll?buildingId="+idBuilding,options)
	   .map((res:Response) => res.json())
	   .map((building:Array<any>) => {
		  let result:Building = new Building();
		  if(building)
		  {
				
				result.site_id = building[0].siteId;
				result.building_id = idBuilding;
				result.reference =  building[0].buildingRef;						
				result.polygon = this.convertStringPolygon(building[0].buildingPolygon);						
				
				if(building[0].floors[0])	
				{
					//console.log("G des enfans");
					result.listFloor = this.constructFloorsOfBuilding(idBuilding,building[0].floors);
				}
				else
				{
					result.listFloor = building[0].floors;
				}
										
				//console.log(result);							
		  }  
		  return result;
	    }	 //map array
		
	  ) 
	  .catch(BuildingService.handleError);	   
	   
   }
   
   
  
   
  constructFloorsOfBuilding(buildId : number,floorsOfABuilding:Array<any>):Array<Floor>
  {
	let result : Array<Floor> = [];
	//console.log(buildId);
	floorsOfABuilding.forEach( (floor) =>{
					//console.log(floor);
				var newFloor = new Floor();	
				
				newFloor.reference = floor.floorRef;
				newFloor.id_floor = floor.floorId;
				newFloor.polygon = this.convertStringPolygon(floor.floorPolygon);	
				
				newFloor.listSpaces = this.constructSpacesOfFloor(floor.floorId,floor.spaces);
				
				/* if(floor.spaces[0])
				{
				}
				else
				{
					newFloor.listSpaces = floor.spaces;
				}
 */				
				newFloor.order_number = floor.order_number;				
				
				result.push(newFloor);
				
			});
	 
	return  result;	  
  }
  
  constructSpacesOfFloor(floorId : number,spacesOfAFloor:Array<any>):Array<Space>
  {
	let result : Array<Space> = [];	
	
	spacesOfAFloor.forEach( (space) =>{
		
				var newSpace = new Space();	
				
				newSpace.reference = space.spaceRef;
				newSpace.id_space = space.spaceId;
				newSpace.id_floor = floorId;
				newSpace.polygon = this.convertStringPolygon(space.spacePolygon);							
				newSpace.listReaders = this.constructReadersOfSpace(space.spaceId,space.readers);
				newSpace.tabObjects = space.objects;
			
				result.push(newSpace);
			});
			
	return  result;	  
  }
  
  
  constructReadersOfSpace(spaceId : number,readerOfASpace:Array<any>):Array<any>{
	  
	  console.log("ya");
	  let result:Array<Reader> = [];
	  
	  readerOfASpace.forEach((reader) => {
		  var newReader = new Reader();
		  
		  newReader.id_reader = reader.readerId;
		  newReader.x = reader.x;
		  newReader.y = reader.y;
		  newReader.reference = reader.readerRef;
		  newReader.id_space = spaceId;
		  
		  
		  console.log(newReader);
		  result.push(newReader);
	  });
	  return  result;	
  }
	  
}
		  
	  

