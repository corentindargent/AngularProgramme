import { Component,OnInit,ViewChild,ElementRef,AfterViewChecked,Input,AfterContentChecked,} from '@angular/core';
import { GMapService } from './gmap-service.service';
import { SiteService} from './service-site.service';

import { Site,Building} from './model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

export class AppComponent implements OnInit,AfterContentChecked  {
	
	public map: google.maps.Map;//conserver une refernce a lamp
	@ViewChild('map') mapRef: ElementRef;//ref au div (elemt HTML) contenant la map
	drawingManager : google.maps.drawing.DrawingManager;
	polygonNonAffiche : boolean = true;
	
	/*Liste de données*/
	building_list : Array<Building>;
	sites_list : Array<Site>;	
	listePolygon : Array<any>;
	
	
	lastSelected: number;
	siteSelected : Site;
	
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
				var tabAllPolygon = new Array(); 
				var tabPolygonBuilding = new Array(); 
				
				
				for(let i = 0; i < this.sites_list.length ;i++)
				{
					tabPolygonBuilding = new Array();//rest tab de building
					var site = new google.maps.Polygon(AppComponent.listOptionsPolygonsSite);		
					var path  = this.sites_list[i].polygon;
					site.setPath(path); 					
					
				
					
					if(this.sites_list[i].listBuidling[0])//si site possede un building
					{
						for(let index = 0 ; index < this.sites_list[i].listBuidling.length ; index++)
						{
							var batiment = new google.maps.Polygon(AppComponent.listOptionsPolygonsBuilding);		
							var path  = this.sites_list[i].listBuidling[index].polygon;
							batiment.setPath(path); 
							
							tabPolygonBuilding.push(batiment);							
						}	
										
					}	
					
					/* ajout nouvelle ligne dnas tableau comprenant tous les polygons 
					  *(ligne comprend polygon site et polygon fils)		*/
					tabAllPolygon.push({"site" : site,"listBuilding":tabPolygonBuilding});
					
					
				}
				
				this.listePolygon = tabAllPolygon;
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
		
		var self = this;
		if(this.lastSelected == i){return;}//si site deja selecionne quitte
		
		if(this.lastSelected == null)
		{
			console.log("pas enceore de cselcetionner");
		}
		else
		{
			
			this.listePolygon[this.lastSelected].site.setMap(null);		//affiche le site
			//console.log(this.listePolygon[this.lastSelected].listBuilding);
			
			if(this.listePolygon[this.lastSelected].listBuilding[0])//signifie qu'il a des fils a cacher
			{
				this.listePolygon[this.lastSelected].listBuilding.forEach(function(element,index){
					
					element.setMap(null);
				})				
			}
		}
		
		this.lastSelected = i;
		
		//centre la map sur le site
		console.log("center map");
		 console.log(this.listePolygon[this.lastSelected].site.getPath().getAt(0))
		this.map.setCenter(this.listePolygon[this.lastSelected].site.getPath().getAt(0));
		this.map.setZoom(18);
		
		//rend visible le site
		this.listePolygon[this.lastSelected].site.setMap(this.map);
		
		this.siteSelected = this.sites_list[this.lastSelected];
		/*se centrer geographiquement sur site */
		//console.log(this.siteSelected);
		
		
		//rend visible les batiments
		this.listePolygon[this.lastSelected].listBuilding.forEach(function(element,index)
		{					
				element.setMap(self.map);
		})		
	}
	
}
