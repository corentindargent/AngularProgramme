/*INTERFACE CORRESPONDANT JSON ENVOYEE*/

export interface ISite
{	
    siteRef:number;
	latitude:number;	
	buildings:Array<IBuilding>;
	sitePolygon:number[][];
	siteId : number;
}




	/* CLASSE */
export class Site {
	
	 reference: string;
     address : string;
	 land_number  : number;
	 latitude : number;
	 longitude  : number;
	 altitude    : number;
     polygon: Array<any>; 
	 site_id : number;
	 listBuidling : Array<Building>;
	
	constructor() 
	{  
		this.reference = '';
		this.address  =  '';
		this.land_number = null;
		this.latitude =  -1;
		this.longitude =  -1;
		this.altitude =  -1;
		this.polygon = null;
		this.site_id =  -1;
		this.listBuidling =  null;
	}
   
}




export class Building  {	
	
	building_id : number; 
	reference: string;    
	latitude  : number;
	longitude  : number;
	altitude    : number;
	orientation : number;
	polygon: Array<any>;
	site_id : number;
	
	constructor() 
	{  
		this.reference = '';		
		this.building_id = -1;
		this.latitude =  -1;
		this.longitude =  -1;
		this.altitude =  -1;
		this.polygon =  null;
		this.site_id =  -1;	
	}
}


export class Floor   {
  constructor(
	public Floor_id  : number, 
	public reference: string,    
	public Order_Number   : number,
	public X  : number,
	public Y    : number,
	public Z : number,
    public polygon: Array<number>,
	public Building_id  : number
	) {  }
}


export class Space    {
  constructor(
	public Space_id   : number, 
	public reference: string,    
	public X  : number,
	public Y    : number,
	public Z : number,
    public polygon: Array<number>,
	public Floor_id  : number
	) {  }
}


export class Reader     {
  constructor(
	public Reader_id    : number, 
	public reference: string, 
    public Mac : string,	
	public X  : number,
	public Y    : number,
	public Z : number,
    public Fixed : boolean,
	public Space_id   : number,
	public Last_Data_Event_Id : number,
	) {  }
}



export class Tag      {
  constructor(
	public Tag_id     : number, 
	public reference: string, 
    public Mac : string,	
	public X  : number,
	public Y    : number,
	public Z : number,
    public Fixed : boolean,
	public Object_id    : number,
	public Last_Data_Event_Id : number,
	) {
  }
}


export class Object {

  constructor(
    public Object_id: number,
    public reference: string){}   
}




export interface IBuilding
{
	buildingRef:number;		
	buildingPolygon:number[][];
	buildingId : number;
	
}