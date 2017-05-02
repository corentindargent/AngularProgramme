import {Component,OnInit,ViewChild,ElementRef,AfterViewChecked,Input,AfterContentChecked } from '@angular/core';

import { GMapService } from '../gmap-service.service';
import { SiteService} from '../service-site.service';
import { BuildingService } from '../building.service';

import { Site,ISite,Building} from '../model';


@Component({
  selector: 'app-new-shapes',
  templateUrl: './new-shapes.component.html',
  styleUrls: ['./new-shapes.component.css']
})
export class NewShapesComponent implements OnInit,AfterContentChecked{

  @Input() newSite : Site;
	@Input() newBuilding : Building;
	siteListes:Array<ISite>; //var de teset certainemtn a bouger
	
	
	
	
	
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
	
	
	
	
	
	
    constructor(private gmapService: GMapService, private siteService: SiteService, private buildingService: BuildingService) { }
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
		        /*PEUT PAS UTILISER DIRECTEMENT LES VARIABLES DEFINIES DANS ANGULAR DOIT PASSER PAR DES ARRAY INTERMETIAIRE*/
				var tabPolygonSite = new Array(); 
				var tabPolygonBuilding = new Array(); 
				var buildingList = new Array();
				
				for(let i = 0; i < this.sites_list.length ;i++)
				{
					var site = new google.maps.Polygon(NewShapesComponent.listOptionsPolygonsSite);		
					var path  = this.sites_list[i].polygon;
					site.setPath(path); 
					site.setMap(this.gmapService.map);					
					tabPolygonSite.push(site);
					
					if(this.sites_list[i].listBuidling[0])//si site possede un building
					{
						
						for(let index = 0 ; index < this.sites_list[i].listBuidling.length ; index++)
						{
							var batiment = new google.maps.Polygon(NewShapesComponent.listOptionsPolygonsBuilding);		
							var path  = this.sites_list[i].listBuidling[index].polygon;
							batiment.setPath(path); 
							batiment.setMap(this.gmapService.map);
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
	/* ngAfterContentChecked() {
    // contentChild is set after the content has been initialized
	console.log("after content checked");   
  } */
	
	 removeDrawingManager(){
		let drawingManagerTest = this.gmapService.getDrawingManager();		
		drawingManagerTest.setOptions({drawingControl: false,drawingMode: null});
	}
	
	
	resetHTML(){
		if(this.isNewSite || this.isNewBuilding ){
			this.isNewSite=false;
			this.isNewBuilding=false;
			this.removeDrawingManager();
		}
		
		if(this.modifSite){
			this.modifSite=false;
			
			//Modification pas confirmer car user decider autre operation rest forme couleur et edition
			this.listePolygon[this.lastSelected].setOptions({fillColor: '#00DE43'});
			this.listePolygon[this.lastSelected].setOptions({editable:false });
		
			var path = this.sites_list[this.lastSelected].polygon;
			this.listePolygon[this.lastSelected].setPath(path);
			
		}
		
		if(this.modifBuilding){
			this.modifBuilding=false;
			/* REST DERNIER SITE SELECTIONNE (COULEUR)*/
		    this.listePolygonBatiment[this.lastSelected].setOptions({fillColor: '#0073F7'});
		}
	}
	
	addPolygons(bool: boolean){//init processus creation site/batiment		
		
		NewShapesComponent.polygon = null;//set à null
		NewShapesComponent.isASite = bool; // var permettant d'associer au ploygone creer les options du site / batiment
		this.resetHTML();
		if(bool)//creation site
		{
			this.newSite = new Site();
			console.log(this.newSite);
			console.log(bool+"SIte");
			this.setDrawingManager();		
			this.isNewSite = bool;
		}
		else
		{
			this.newBuilding = new Building();
			this.setDrawingManager();		
			this.isNewBuilding = !bool;
			console.log(bool+"Batiment");
			
		}		
	}
	
	setDrawingManager(){		
		let drawingManagerTest = this.gmapService.getDrawingManager();		
		drawingManagerTest.setOptions({drawingControl: true});
		google.maps.event.addListener(drawingManagerTest, 'polygoncomplete', this.polygonCompleteEvent);
	}
	
	addNewBuilding(){
		console.log(this.newBuilding.site_id);
		if(this.newBuilding.site_id != -1){
			if(!NewShapesComponent.polygon)
			{
				this.errorMessage = "Trace du polygone obligatoire";			
			}
			else{
				
				this.errorMessage = "";		
				console.log(this.newBuilding.site_id);
				this.newBuilding.polygon = NewShapesComponent.polygon.getPath().getArray();
						
				/*APPEL SERVICE CREATION BUILDING*/
					this.buildingService.addBuilding(this.newBuilding).subscribe(
						building => {console.log('create result received:');console.log(building);},
						(err:any) => console.error(err) 
					);
					
				this.isNewBuilding = false;//PRESENT DANS METHODE RESETHTML PEUT SUPP
				this.removeDrawingManager();	//RETIRE OUTIL GOOGLE MAPS D' EDITION DES FORMES		
			}
		}else{
			this.errorMessage = "Veuillez selectionner un site";
		}
	}
		
	
	
	addNewSite(){
		
		if(!NewShapesComponent.polygon)
		{
			this.errorMessage = "Trace du polygone obligatoire";			
		}
		else{			
			this.errorMessage = "";			
			
		    this.newSite.polygon = NewShapesComponent.polygon.getPath().getArray();	
				
				/*APPEL SERVICE CREATION BUILDING*/
					this.siteService.addSite(this.newSite).subscribe(
						site => {console.log('create result received:'+site);this.sites_list.push(site);},
						(err:any) => console.error(err) 
					);
					
				this.isNewSite = false; //PRESENT DANS METHODE RESETHTML PEUT SUPP
			
			
			 
			this.removeDrawingManager();	//RETIRE OUTIL GOOGLE MAPS D' EDITION DES FORMES		
		}
		
	}
	
	
	
	polygonCompleteEvent(newPolygon){		 
		  
	    if(NewShapesComponent.polygon){
			
			newPolygon.setMap(null);
			
		}		
		else
		{	var confirmBox = confirm("Valider-vous la forme créée");
			if(confirmBox)
			{
				console.log("Forme Confirmée");
				
				NewShapesComponent.polygon = newPolygon;
				/*console.log("Nw polygon "+newPolygon);				
				console.log(newPolygon);				
				console.log("NewShapesComponent "+NewShapesComponent.polygon);	
				console.log(NewShapesComponent.polygon);*/
				if(NewShapesComponent.isASite)
				{
					newPolygon.setOptions(NewShapesComponent.listOptionsPolygonsSite);					
				}
				else
				{
					newPolygon.setOptions(NewShapesComponent.listOptionsPolygonsBuilding);
				}				
					
					//retire option de dessin
				
			}
			else
			{
				console.log("supp");
				newPolygon.setMap(null);
				//set NewShapesComponent.polygon qd ajout effectue ou 
				NewShapesComponent.polygon=null;
				
				//*peut etre autre cinfrim box -> si oui continue edtion du polygone, si non retourne page accueil */
				alert("Vous pouvez redessiner la forme");
				
			}
		}
	}
	
	
	onSelectSite(index : number)
    {
		console.log("Dernier Select :"+ this.lastSelected);
		
		/* REST DERNIER SITE SELECTIONNE (COULEUR,EDITABLE et forme de base)*/
		this.listePolygon[this.lastSelected].setOptions({fillColor: '#00DE43'});
		this.listePolygon[this.lastSelected].setOptions({editable:false });
		
		var path = this.sites_list[this.lastSelected].polygon;
		this.listePolygon[this.lastSelected].setPath(path);
		
		
		
		
		/* NOUVEAU SELECTIONNE */
        this.lastSelected = index;
		this.listePolygon[this.lastSelected].setOptions({fillColor:"#EEFE0B"});
		this.listePolygon[this.lastSelected].setOptions({editable:true });
		console.log("Dernier Select (apres modif) :"+ this.lastSelected);
		
	}
	
	modificationSite()	
	{	
	    console.log("Modif");
		this.resetHTML();
		this.modifSite = true;
		this.selectedPolygon = 0; // par defaut le premier element sera selectionne
		
			//this.listePolygon = this.sites_list;
		console.log(this.listePolygon);
		this.lastSelected = this.selectedPolygon;
		this.listePolygon[this.lastSelected].setOptions({fillColor:"#EEFE0B",editable:true})
		
		//google.maps.event.addListener(,"click",function(){console.log("modf");this.setOptions({fillColor:"#EEFE0B"});});	
	}
	
	
	modificationSiteConfirme(){
		
		
		console.log("Current Polygon"+this.sites_list[this.lastSelected].polygon);
		console.log("New Polygon"+this.listePolygon[this.lastSelected].getPath().getArray());
		
		this.sites_list[this.lastSelected].polygon = this.listePolygon[this.lastSelected].getPath().getArray();
		
		console.log("Current Polygon after modif"+this.sites_list[this.lastSelected].polygon);
		console.log("Modif refernece"+this.sites_list[this.lastSelected].reference);
		
		this.siteService.updateSite(this.sites_list[this.lastSelected]).subscribe(
						site => {console.log('create result received:'+site);this.sites_list.push(site);},
						(err:any) => console.error(err) 
		);
		
	}
	
/*modif building*/	
	onSelectBuilding(index : number)
    {
		console.log("Dernier Select :"+ this.lastSelected);
		
		/* REST DERNIER SITE SELECTIONNE (COULEUR)*/
		this.listePolygonBatiment[this.lastSelected].setOptions({fillColor: '#0073F7'});
				
		/* NOUVEAU SELECTIONNE */
        this.lastSelected = index;
		this.listePolygonBatiment[this.lastSelected].setOptions({fillColor:"#EEFE0B"});
		console.log("Dernier Select (apres modif) :"+ this.lastSelected);
		
	}
	
	modificationBuilding()	
	{	
	   console.log("Modif");
	   this.resetHTML();
		this.modifBuilding = true;
		this.selectedPolygon = 0; // par defaut le premier element sera selectionne
		
			//this.listePolygon = this.sites_list;
		console.log(this.listePolygonBatiment);
		this.lastSelected = this.selectedPolygon;
		this.listePolygonBatiment[this.lastSelected].setOptions({fillColor:"#EEFE0B"})
		
		//google.maps.event.addListener(,"click",function(){console.log("modf");this.setOptions({fillColor:"#EEFE0B"});});	
	}
	
	
	modificationBuildConfirme(){		
		
		console.log("Current Polygon after modif"+this.building_list[this.lastSelected].polygon);
		console.log("Modif refernece"+this.building_list[this.lastSelected].reference);
		
		this.building_list[this.lastSelected].polygon = this.listePolygonBatiment[this.lastSelected].getPath().getArray();
		
		
		this.buildingService.updateBuilding(this.building_list[this.lastSelected]).subscribe(
						site => {console.log('create result received:');},
						(err:any) => console.error(err) 
		);
		
	}

}
