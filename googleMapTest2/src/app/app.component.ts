import { Component,OnInit,ViewChild,ElementRef,AfterViewChecked,Input,AfterContentChecked } from '@angular/core';
import { GMapService } from './gmap-service.service';
import { SiteService} from './service-site.service';

import { Site,ISite,Building} from './model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

export class AppComponent implements OnInit,AfterContentChecked  {
	
	@Input() newSite : Site;
	@Input() newBuilding : Building;
	siteListes:Array<ISite>; //var de teset certainemtn a bouger
	public map: google.maps.Map;
	
	
	selectedSite : number;
	
	building_list : Array<Building>;
	sites_list : Array<Site>;	
	// sitePolygon : Array<google.maps.Polygon>; liste contenant tous les polygons afin
	
    @ViewChild('map') mapRef: ElementRef;
	isOneSite : boolean = false;	
	newPolySite : boolean;
    drawingManager : google.maps.drawing.DrawingManager;
	isNewSite : boolean = null;
	isNewBuilding : boolean;
	adressePostal : string;
	nomSite : string;
	static polygon : google.maps.Polygon ;
	static isASite : boolean;
	errorMessage :string;
	listePolygon : Array<any>;
	listePolygonBatiment : Array<any>;
	polygonNonAffiche : boolean = true;
	
	
	
	/* VARIABLE DE MODIFICATION */
	
		/* SITE */
	modifSite : boolean = false;
	modifBuilding : boolean = false;
	@Input()selectedPolygon : number;
	lastSelected: number;
	
	
	/* OPTIONS DES POLYGONE CRÉÉS */	
    static listOptionsPolygonsSite : Object  = { 
			strokeColor: '#010101',
			strokeOpacity: 0.8, 
			strokeWeight: 2,
			fillColor: '#00DE43',
			fillOpacity: 0.2,				
	};
	
	static listOptionsPolygonsBuilding : Object = {				
			strokeColor: '#010101',
			strokeOpacity: 0.8, 
			strokeWeight: 2,
			fillColor: '#0073F7',
			fillOpacity: 0.35,
	};
	
	/*var de test*/
	colorChange = "red";
	
	
	
	
	
	
    constructor(private gmapService: GMapService, private siteService: SiteService) { }
    yop(){console.log("Tu veux un yop");}
	
	ngOnInit(){	
	
		/*GET all site and building*/
		 this.siteService.getSiteAndBuild()
		.subscribe(
			(listeSite : Array<Site> ) => {
				console.log("Array Site");				
				this.sites_list = listeSite;
			},
			
			(err:any) => {console.error(err); console.log(err.body)}
			
		);			
			
	}
	
	
    ngAfterContentChecked(){ 
	
	 
		if(this.gmapService.loadEnd && this.polygonNonAffiche)
		{
			console.log("after content init");
			
			if(this.sites_list)
			{	
				this.map = this.gmapService.map;//get refrence de la map; pour pouvoir cahcer ou affiche les polygons sur la map
				
		        /*PEUT PAS UTILISER DIRECTEMENT LES VARIABLES DEFINIES DANS ANGULAR DOIT PASSER PAR DES ARRAY INTERMETIAIRE*/
				var tabPolygonSite = new Array(); 
				var tabPolygonBuilding = new Array(); 
				var buildingList = new Array();
				
				for(let i = 0; i < this.sites_list.length ;i++)
				{
					var site = new google.maps.Polygon(AppComponent.listOptionsPolygonsSite);		
					var path  = this.sites_list[i].polygon;
					site.setPath(path); 
					tabPolygonSite.push(site);
					
					if(this.sites_list[i].listBuidling[0])//si site possede un building
					{
						
						for(let index = 0 ; index < this.sites_list[i].listBuidling.length ; index++)
						{
							var batiment = new google.maps.Polygon(AppComponent.listOptionsPolygonsBuilding);		
							var path  = this.sites_list[i].listBuidling[index].polygon;
							batiment.setPath(path); 							
							tabPolygonBuilding.push(batiment);
							
							buildingList.push(this.sites_list[i].listBuidling[index]);
							console.log(this.sites_list[i].listBuidling[index]);
						}	
						this.listePolygonBatiment = tabPolygonBuilding;					
					}			
					
					
				}
				
				this.building_list = buildingList;
				this.listePolygon = tabPolygonSite;
				this.polygonNonAffiche = false;
			}
		}
	}
	
	
	 removeDrawingManager(){
		let drawingManagerTest = this.gmapService.getDrawingManager();		
		drawingManagerTest.setOptions({drawingControl: false,drawingMode: null});
	}
	
	drawPolygon(siteList: Array<Site> )	{
		//desisner
	}
	
	selectView(i : number){
		console.log(i);
		if(this.lastSelected == null)
		{
			console.log("pas enceore de cselcetionner");
		}
		else
		{
			console.log("Last"+this.lastSelected);
			this.listePolygon[this.lastSelected].setMap(null);		
		}
		
		this.lastSelected = i;
		this.listePolygon[this.lastSelected].setMap(this.map);
	}
	
	resetHTML(){
		this.isNewSite=false;
		this.isNewBuilding=false;
	}
	
}
