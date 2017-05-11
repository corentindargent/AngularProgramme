import {Component,OnInit,ViewChild,ElementRef,AfterViewChecked,Input,AfterContentChecked } from '@angular/core';

import { GMapService } from '../gmap-service.service';
import { SiteService} from '../service-site.service';
import { BuildingService } from '../building.service';

import { Site,Building} from '../model';


@Component({
  selector: 'app-new-shapes',
  templateUrl: './new-shapes.component.html',
  styleUrls: ['./new-shapes.component.css']
})
export class NewShapesComponent implements OnInit,AfterContentChecked{

	@ViewChild('map') mapRef: ElementRef;//ref au div (elemt HTML) contenant la map
	public map: google.maps.Map;//conserver une refernce a la map Google pour gerer affichage ou non des polygon
	polygonNonAffiche : boolean = true;//permet de savoir si google maps est charge
	drawingManager : google.maps.drawing.DrawingManager;
	errorMessage :string;//permettra d'afficher des eventuels erreurs
	
	isOneSite : boolean = false;	// a virer plus tard et code html qui en depend
	
	/* LISTES COMPRENANT LES DONNÉES */
		building_list : Array<Building>; //listes tous les batiments leurs données 
		sites_list : Array<Site>;	//listes tous les sites leurs données 
		
		
		//Liste des polygon google - conserver pour association d'event changement de couleur ...
		listePolygonSite : Array<any>;//liste des polygons site creer grace au données
		listePolygonBatiment : Array<any>;
		
		listOfAllPolygon : Array<any>;
		
		
	
	/* VARIABLE DE AJOUT */	
	    static polygon : google.maps.Polygon ;
	    static isASite : boolean;
	
	  /* SITE */
		@Input() newSite : Site;
		isNewSite : boolean = null;
		
	  /* BUILDING */
		@Input() newBuilding : Building;
		isNewBuilding : boolean;
		
				
	/* VARIABLE DE MODIFICATION */	
		lastSelected: number;
		@Input()selectedPolygon : number;
	
	  /* SITE */
		modifSite : boolean = false;
		@Input()siteUpdate : Site = new Site();	
	
	  /* BUILDING */
		@Input()buildUpdate : Building = new Building();
		modifBuilding : boolean = false;
	
	
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
	
    constructor(private gmapService: GMapService, private siteService: SiteService, private buildingService: BuildingService) { }

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
			if(this.sites_list)
			{	
				this.map = this.gmapService.map;
		        /*PEUT PAS UTILISER DIRECTEMENT LES VARIABLES DEFINIES DANS ANGULAR DOIT PASSER PAR DES ARRAY INTERMETIAIRE*/
				var tabPolygonSite = new Array(); 
				var tabPolygonBuilding = new Array(); 
				var buildingList = new Array();
				
				for(let i = 0; i < this.sites_list.length ;i++)
				{
					tabPolygonBuilding = new Array();
					var site = new google.maps.Polygon(NewShapesComponent.listOptionsPolygonsSite);		
					var path  = this.sites_list[i].polygon;
					site.setPath(path); 										
					tabPolygonSite.push(site);
					
					if(this.sites_list[i].listBuidling[0])//si site possede un building
					{
						
						for(let index = 0 ; index < this.sites_list[i].listBuidling.length ; index++)
						{
							var batiment = new google.maps.Polygon(NewShapesComponent.listOptionsPolygonsBuilding);		
							var path  = this.sites_list[i].listBuidling[index].polygon;
							batiment.setPath(path); 							
							tabPolygonBuilding.push(batiment);
							
							buildingList.push(this.sites_list[i].listBuidling[index]);
							console.log(this.sites_list[i].listBuidling[index]);
						}	
						this.listePolygonBatiment = tabPolygonBuilding;		
					
					}
				
					//Array de tous polygons : par ligne on a polygon du site et les polygons des batimenst du site
					//this.listOfAllPolygon.push({"site" : site,"listBuilding":tabPolygonBuilding});
					
					
				}
				
				this.building_list = buildingList;
				this.listePolygonSite = tabPolygonSite;
				this.polygonNonAffiche = false;
			}
		}
	}
	
	//retire edition forme dans google map
	 removeDrawingManager(){
		let drawingManagerTest = this.gmapService.getDrawingManager();		
		drawingManagerTest.setOptions({drawingControl: false,drawingMode: null});
	}
	
	
	resetHTML(){
		this.lastSelected = null; //reset à null
		if(this.isNewSite || this.isNewBuilding ){
			this.isNewSite=false;
			this.isNewBuilding=false;
			this.removeDrawingManager();
		}
		
		if(this.modifSite){
			this.modifSite=false;
			this.resetLastSiteSelected();			
		}
		
		if(this.modifBuilding){
			this.modifBuilding=false;
			/* REST DERNIER SITE SELECTIONNE (COULEUR)*/
		    this.listePolygonBatiment[this.lastSelected].setOptions({fillColor: '#0073F7'});
		}
	}
	
	addPolygons(bool: boolean){//init processus creation site/batiment		
		this.resetHTML();
		
		console.log(bool);
		NewShapesComponent.polygon = null;//set à null var qui contiendra polygon dessiné
		NewShapesComponent.isASite = bool; // permet de savoir si ajout site/buildin pour associer les options de 'styles' au polygon
		
		this.setDrawingManager();
		if(bool)//creation site
		{
			this.newSite = new Site();					
			this.isNewSite = true;
		}
		else//creation batiment
		{
			this.newBuilding = new Building();					
			this.isNewBuilding = true;
		}		
	}
	
	
	siteForNewBuilding(i : number){
		console.log(i);
		console.log(this.lastSelected);
		if(this.lastSelected == i){console.log("return");return;}
		
		if(this.lastSelected)
		{
			this.resetLastSiteSelected();
		}
		
		this.lastSelected = i;
		this.setNewSiteSelected();
	}
	
	//asscocie boit d'edition de forme a la map google
	setDrawingManager(){		
		let drawingManagerTest = this.gmapService.getDrawingManager();		
		drawingManagerTest.setOptions({drawingControl: true});
		google.maps.event.addListener(drawingManagerTest, 'polygoncomplete', this.polygonCompleteEvent);
	}
	
	//confirm ajout new building
	confirmAddNewBuilding(){
		
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
		}
		else{
			
			this.errorMessage = "Veuillez selectionner un site";
		}
	}
	
		//confirm ajout new site
	confirmAddNewSite(){
		
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
	
	
	//event declenche qd cloture la forme d'un polygon
	polygonCompleteEvent(newPolygon){		 
		  
	    if(NewShapesComponent.polygon){	//si deja une nouvelle forme qui est dessiné on set à null	
			newPolygon.setMap(null);			
		}		
		else
		{	var confirmBox = confirm("Valider-vous la forme créée");
			if(confirmBox)
			{
				NewShapesComponent.polygon = newPolygon;
				
				//associe les couleurs de style selon creation site ou batiment
				if(NewShapesComponent.isASite)
				{
					newPolygon.setOptions(NewShapesComponent.listOptionsPolygonsSite);					
				}
				else
				{
					newPolygon.setOptions(NewShapesComponent.listOptionsPolygonsBuilding);
				}	
			}
			else
			{
				newPolygon.setMap(null);
				NewShapesComponent.polygon=null;
				alert("Vous pouvez redessiner la forme");
			}
		}
	}
	
	modificationSite(){	
	    console.log("Modif");
		this.resetHTML();
		this.modifSite = true;
		this.selectedPolygon = 0;
		
		//conserve trace du dernier selectionne
		this.lastSelected = 0;//par defaut sera le premier site
	
		this.setNewSiteSelected();	
		this.listePolygonSite[this.lastSelected].setOptions({editable:true});		
	}	
	
	
	resetLastSiteSelected(){
		this.listePolygonSite[this.lastSelected].setOptions({fillColor: '#00DE43'});
		this.listePolygonSite[this.lastSelected].setOptions({editable:false });	
		
		var path = this.sites_list[this.lastSelected].polygon;
		this.listePolygonSite[this.lastSelected].setPath(path);		
		this.listePolygonSite[this.lastSelected].setMap(null);
		
	
		
	}
	
	setNewSiteSelected(){		
		this.listePolygonSite[this.lastSelected].setMap(this.map);
		this.listePolygonSite[this.lastSelected].setOptions({fillColor:"#EEFE0B"});//set sa couleur
		this.map.setCenter(this.listePolygonSite[this.lastSelected].getPath().getAt(0));//centre la map dessus
		this.map.setZoom(17);
		
		
		
		//garnit variable de modif
		this.siteUpdate.reference =  this.sites_list[this.lastSelected].reference;
		this.siteUpdate.site_id = this.sites_list[this.lastSelected].site_id;
	}
	
	
	onSelectSite( index : number ){
		
		if(index == this.lastSelected){ return;}
		
		/* REST DERNIER SITE SELECTIONNE (COULEUR,EDITABLE et forme de base)*/
		this.resetLastSiteSelected();
		
		/* NOUVEAU SELECTIONNE */
        this.lastSelected = index;
		this.setNewSiteSelected();	
		this.listePolygonSite[this.lastSelected].setOptions({editable:true});
	}
	
	
	confirmUpdateSite(){
		
		this.siteUpdate.polygon = this.listePolygonSite[this.lastSelected].getPath().getArray();
		console.log(this.siteUpdate);
		this.siteService.updateSite(this.siteUpdate).subscribe(
						site => {console.log('create result received:'+site);},
						(err:any) => console.error(err) 
		);		
	}
	
/*MODIF BUILDING*/	

	modificationBuilding(){	
	
		    this.resetHTML();
			this.modifBuilding = true;			
			this.selectedPolygon = 0;
			
			this.lastSelected = 0; // par defaut le premier element sera selectionne
			this.setNewBuildingSelected();
			
	}
		
	setNewBuildingSelected(){
		
		this.listePolygonBatiment[this.lastSelected].setMap(this.map);
		this.listePolygonBatiment[this.lastSelected].setOptions({fillColor:"#EEFE0B"})
		this.map.setCenter(this.listePolygonBatiment[this.lastSelected].getPath().getAt(0));//centre la map dessus
		this.map.setZoom(17);	
			
		 //garnit la variable de modification
		this.buildUpdate.reference = this.building_list[this.lastSelected].reference;
		this.buildUpdate.site_id = this.building_list[this.lastSelected].site_id;
		this.buildUpdate.building_id = this.building_list[this.lastSelected].building_id;
	}
		
	onSelectBuilding(index : number){
		
		if(this.lastSelected == index){return;}	
		
		/* REST DERNIER SITE SELECTIONNE (COULEUR)*/
		this.listePolygonBatiment[this.lastSelected].setOptions({fillColor: '#0073F7'});
				
		/* NOUVEAU SELECTIONNE */		
        this.lastSelected = index;
		this.setNewBuildingSelected();
	}
		
	confirmUpdateBuild(){		
		
		this.buildUpdate.polygon = this.listePolygonBatiment[this.lastSelected].getPath().getArray();
		console.log(this.buildUpdate);
		this.buildingService.updateBuilding(this.buildUpdate).subscribe(
						site => {console.log('create result received:');},
						(err:any) => console.error(err) 
		);
		
	}

}
