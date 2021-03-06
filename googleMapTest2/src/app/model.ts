
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
	this.mac = null; // non modifiable
	this.id_space = -1;
	this.id_reader = -1; 
    this.Last_Data_Event_Id = null; 	
  }
}


export class Object {

//attr entite
  id_object : number;
  reference : string;
  
//attr en + pour listing  
  spaceRef : string;
  spaceId : number;
  buildId : number;
  floorRef : string;
  buildRef : string;
  siteRef : string;
  date_detection:any;
  
  
  constructor()
  {
	 this.id_object = -1;
	 this.reference = ""; 
	 
	 this.spaceRef = "";	
	 this.spaceId = null;	
	 this.buildId = null;
	 this.floorRef = "";
	 this.siteRef = "";
	 this.buildRef = "";
	 this.date_detection = null
	 
	 
  }   
}



export class Tag      {	
	id_tag : number; 
	reference: string; 
    mac : string;	
	x : number;
	y : number;
	z : number;
    fixed : boolean;
	id_object : number;
	last_data_event_id : number;
	
  constructor(){ 
	this.id_tag = -1; 
	this.reference = ""; 
    this.mac = "";	
	this.x = 0; 
	this.y = 0; 
	this.z = 0; 
    this.fixed = false;
	this.id_object = null;
	this.last_data_event_id  = null;
  
  }
}

