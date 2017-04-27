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
	listFloor : Array<Floor>;
	
	constructor() 
	{  
		this.reference = '';		
		this.building_id = -1;
		this.latitude =  -1;
		this.longitude =  -1;
		this.altitude =  -1;
		this.polygon =  null;
		this.site_id =  -1;	
		this.listFloor = null;
	}
}

export class PointsSvg{
	
	constructor(	
		public x  : any,
		public y    : any,	
	) {}
	
}

export class Floor   {
	
	reference : string;
	y : number;
	x : number;
	z : number;
	order_number : number;
	id_building : number;
	polygon: Array<any>;
	id_floor : number;
	listSpaces : Array<Space>;
	
  constructor() 
  {  
	this.reference = "";
	this.y = -1;
	this.x = -1;
	this.z = -1;
	this.order_number = -1;
	this.id_building = -1;
	this.polygon = null;
	this.id_floor = -1;  
	this.listSpaces = new Array();
  }
}




export class Space    {
	
	reference : string;
	y : number;
	x : number;
	z : number;
	id_floor : number;
	polygon: Array<any>;
	id_space : number;
	listReaders : Array<Reader>;
	tabObjects : Array <Object>;
	
  constructor() 
  { 
	this.reference = "";
	this.y = -1;
	this.x = -1;
	this.z = -1;
	this.id_floor = -1;
	this.polygon = null;
	this.id_space = -1;
	this.listReaders = null;  
    this.tabObjects	 = null;
  }
}


export class Reader     {
	
	 id_reader: number;
	 reference: string;
     mac : string;
	 y : number;
	 x : number;
	 z : number;
     fixed : boolean;
	 id_space   : number;
	 Last_Data_Event_Id : number;
	
  constructor() 
  { 
    this.reference = "";
	this.y = -1;
	this.x = -1;
	this.z = -1;
	this.fixed = null;
	this.mac = "";
	this.id_space = -1;
	this.id_reader = -1; 
    this.Last_Data_Event_Id = null; 	
  }
}


export class Object {

  id_object : number;
  reference : string;
  
  constructor()
  {
	 this.id_object = -1;
	 this.reference = ""; 	  
  }   
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

export interface IBuilding
{
	buildingRef:number;		
	buildingPolygon:number[][];
	buildingId : number;
	
}