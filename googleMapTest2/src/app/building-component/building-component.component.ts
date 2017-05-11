import { Component, OnInit, ViewChild, ElementRef,Input } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Location }                 from '@angular/common';

 
import { BuildingService } from '../building.service';
import { FloorService }  from '../floor.service';
import { SpaceService } from '../space.service';
import { ReaderService } from '../reader.service';
import { Building,Floor,Space,Reader } from '../model'
import * as d3 from 'd3';



@Component({
  selector: 'building-component',
  templateUrl: './building-component.component.html',
  styleUrls: ['./building-component.component.css']
})

export class BuildingComponent implements OnInit {

  @ViewChild('svg') svgRef: ElementRef;
  svg :any;
  svgNoeud: any;
  
  private building_data : Building; // contiendra les données du batiment recuperer dasn les services
  private buildingId : number;// id du batiment passer en argument dans url de la page
  private currentFloor : Floor;//etage actuellement affiché
  
  private selectedSpace : any = null;
  basicView : boolean;//affiche form html
  
  //VAR DRAWNG SVG
  pointsPolygon : Array<any>; // les points de la forme du nouvel espace
  drawing : boolean = false;
  
 //VAR - CREATE NEW FLOOR/SPACE/READER  
 
	  @Input() newFloor : Floor; // var lié au form ajout new floor
	  isANewFloor : boolean = false; //affiche form html
	  
	  @Input() newSpace : Space;  // var lié au form ajout new Space
	  isANewSpace : boolean = false; //affiche form html
	  errorMessage : string;
	  formeSpace : Array<any>;
	  floorId : number;  
	  
	  @Input() newReader : Reader; // var lié au form ajout new Reader
	  isANewReader : boolean = false; //affiche form html
	  lastSelectedSpace  : any;
	  shapeNewReader : any; // forme shape reader
	  
	  notYetFloor : boolean; //deactive action du reader espace si pas le batiment possede pas encore de floor

   
  //VAR - MODIFICATION SPACES  
    UpdateSpace : boolean = false;  
    @Input() spaceUpdate : Space = new Space();
	
  //VAR - MODIFICATION POS READER
	  selectedReader : any;
	  private spaceIndex : any; // indice de l'espace dans du reader dans var de donnéés
	  private readerIndex : any; // indice du reader selectionne dans var de donnéés
	  UpdateReader : boolean = false;
	  spaceOfReader : any;
	  @Input() readerUpdate : Reader = new Reader();//***
	  
	  
  constructor(private route : ActivatedRoute, private location: Location,
  private buildingService: BuildingService, private  floorService : FloorService, 
  private spaceService : SpaceService, private readerService : ReaderService) 
  {}

  ngOnInit() {
	  console.log("FENETRE BUILDING");
	
	 this.route.params.forEach((params :Params) => {
		this.buildingId = +params['id'];
		 
	 });
	 
	 this.initPage();	
  }
  
  initPage(){
	  
	  this.building_data = new Building();
	  this.currentFloor = null;
	 this.buildingService.getDataOfABuild(this.buildingId) // recupere les données d'un batiment via son id
    .subscribe(
		(building : Building )  => {
			this.building_data = building;			
			this.svgNoeud = document.getElementById('svg');
			this.initPolygon();// init processus d'edition forme de l'etage du batiment
		},
		(err:any) => {console.error(err); console.log(err.body)}
	);
	  
  }
  
  
  /* /reste html et retire les eventuels lsitener en fct de la derniere operation qui a eu lieu
   */
  resetHtml(){
	
	var g = d3.select('#g');//get le 1st g comprenant la forme de l'étage
	var gChild = g.selectAll('g');//get tous les g (où un g == 1 space) de c comprenant la forme de l'étage
	gChild.selectAll('polygon').on('click',null);
		
    gChild.on("mouseover",null)
		.on("mouseout",null)
		.on("click",null);
	this.basicView = false;
		
	gChild.selectAll("circle").on("click",null);//retire event sur reader
	
	//si derniere op = newReader => retirer cercle set couleur de base+ remove html
	if(this.isANewReader){
		
		this.isANewReader = false;
		if(this.lastSelectedSpace)
		{
		  this.shapeNewReader.remove();			 
		  this.lastSelectedSpace.setAttribute('fill', 'red');
		}  
	}
	
	//si derniere operation ajout space retirer les listener et le formulaire
	if(this.isANewSpace) {
		this.isANewSpace = false;
		g.on("mouseup",null)
		g.on("mousemove",null);
	}
	
	//si derniere op ajout NewFloor -> retire le form + redessiner le 1er etage
	if(this.isANewFloor){
	  this.isANewFloor = false;
	  this.drawFloor(this.building_data.listFloor[0]);
	}
	
	if(this.UpdateSpace)//si dernier op modifSpace
	{
		if(this.selectedSpace)//si qq chose stocke, set le dernier selectionner a defaut
		{
			this.setLastSpaceAtDefault();
		}
		this.UpdateSpace = false;		
	}
	
	if(this.UpdateReader)//si dernier op modifReader
	{
		if(this.selectedReader)
		{
			this.setLastSelectedReaderAtDefaut();
		}
		
		this.UpdateReader = false;		
	}
	
 }
  
  initPolygon(){
	  
		if(this.building_data.listFloor[0])// si le batiment comprend etage 
		{
			this.notYetFloor = true;
			this.drawFloor(this.building_data.listFloor[0]);// dessine la forme de l'etage
		}
		else
		{
			this.notYetFloor = false;
			this.init();	// on dessine la forme du batiment (avec une conversion COORD GOOGLEMAPS en XY SVG)				
		} 
  }
  
  // Dessine un etage donné
  drawFloor(floor : Floor){	 
  
      if(this.currentFloor == floor){return;}//quitte si etage deja dessisner
  
	//ajout - ACTIVation BOUTON CREATION piece
	
	  this.currentFloor = floor;
	  this.floorId = floor.id_floor;//conserve l'id de l'etage necessaire lors de l'ajout d'une pièce
	  this.selectedSpace = null;
      this.selectedReader = null;

	//Dessiner les elelemnst de l'etage (sa forme, ses pièces et les readers)
	
	  var svg = d3.select('svg');
	  
	  //set le svg a  vide
		svg.select('g').remove();
	  
	  
	  
	  //dessiner la forme global de l'etage
	 var g =  svg.append('g').attr('id', 'g'); 
	 var polygon = g.append('polygon')
			.attr('id', 'poly')
			.attr('stroke', 'black')
			.attr('stroke-width', '4')
			.attr('fill', 'white')
			.attr('stroke', 'black')
			.attr("points", this.arrayToSvgPath(floor.polygon))//conversion 
 
	    
	   
	  /* Dessin la forme des pièces et des étages */ 
	   var self =this;	 
	   //self.basicView = true;   visible un tableau  selection espace
	  floor.listSpaces.forEach(function(element,index)
	   {
		  
		   var g_space = g.append('g')
				.attr('id', "g"+index);
				
			var polygonSpace = g_space.append('polygon')
				.attr("points", self.arrayToSvgPath(element.polygon))
				.attr('id', ""+index)
				.attr('stroke-width', '2')
				.attr('stroke', 'black')
				.attr('fill', 'red')
				//.on("mouseover",function(){this.setAttribute('fill', '#00FE08');self.selectedSpace = this.id; })
				//.on("mouseout",function(){this.setAttribute('fill', 'red');self.selectedSpace = null;})
				.on('click',function(){self.editShapesOfSpace(this)})
			
				element.listReaders.forEach(function(element,index)//dessine les readers de l'espace
				{
					  
					   console.log(element);
						var circle = g_space.append('circle')
						
						  //si forme reader cercle
							.attr("cx", element.x)
							.attr("cy", element.y)
							.attr('r', 4)
							
							//si forme reader rect
							/* .attr("x", element.x)
							.attr("y", element.y)
							.attr('width', 4)
							.attr('height', 4) */
							
							.attr('fill', '#81DAF5')
							.attr('stroke', 'black')
							.attr('is-handle', 'true')
							.attr('id',"Reader"+index+"OfSpace"+element.id_space) 
							/* id assez long pour permettre d'avoir un id unique car utilisation selectByIdn
							
							peut etre retirer simplifie etant dnne que l'on applique event directement sur l'element clique */
							.on("click",function(){self.updatePosReader(this)})
				});
	   
	   });
	 
  }
  
  
  
  
  
  /* UPDATE SHAPE SPACE */  
  updateSpaces(){	    
	  this.resetHtml();	  
	  var self = this;	  
	   //on recupere tous les ploygons(== pieces) et associe event listener
	   d3.select('#g').selectAll('g').selectAll('polygon').on('click',function(){self.editShapesOfSpace(this)});
  }
  
  //bouton confirmation update
  confirmUpdateSpace(){
	  
	  this.spaceUpdate.polygon = this.selectedSpace.points;
	  this.spaceUpdate.x = this.selectedSpace.points[0].x;
	  this.spaceUpdate.y = this.selectedSpace.points[0].y;
	  this.spaceUpdate.id_floor = this.floorId;
	  
	  console.log(this.spaceUpdate);
	  this.spaceService.updateSpace(this.spaceUpdate).subscribe(
			floor => {console.log('create new floor'+floor);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  ); 
		  
	  this.UpdateSpace = false;
	}
    
  setLastSpaceAtDefault(){
	    var index = this.selectedSpace.id;
		this.selectedSpace.setAttribute('fill', 'red');
		
		var circles = d3.select("#g"+index).selectAll('circle.circle-handler');//pour recupere uniqument les cerlces du polygon qui ne sont pas des readers 
		circles.remove();
		this.selectedSpace.setAttribute("points",this.arrayToSvgPath(this.currentFloor.listSpaces[index].polygon));
  }
  
  //modifier forme de l'espace selectionné  
  editShapesOfSpace(polygon : any){
	  
	  if(this.UpdateReader)//Bloquer modification car deja entrain de modifier un Reader
	  {
		  return;
	  }
	  
    this.UpdateSpace = true;//set visible formaulaire
	
	 if(this.selectedSpace)//si qq chose stocke, set le dernier selectionner a defaut
	 {
		this.setLastSpaceAtDefault();
	 }
	 
	this.selectedSpace = polygon;
	this.selectedSpace.setAttribute('fill', '#00FE08');
	 

	/* on place le parent du polygon a la fin des enfants du "grand - pere" du polygon. 
	Pour qu'a la modif le polygon selectionne soit sur le premier plan.
	Sans cela en fct de la pos dasn arboresence dom l'edition du polygon sera + complique.
	*/ 
	 var g = polygon.parentNode.parentNode;
	 console.log(g);
	 g.appendChild(polygon.parentNode);
	 
	 //garnit la varaible d'update avec les info du polygon selectionne
	this.spaceUpdate.reference = this.currentFloor.listSpaces[this.selectedSpace.id].reference;
    this.spaceUpdate.id_space = this.currentFloor.listSpaces[this.selectedSpace.id].id_space;
	
	 
	  var self = this;
	  
	  //ajout au polygon selection des cerlce a ses poiints
	  //cerlce qui permettraont d'editer laforme du polygon
	  var parentNode = d3.select("#g"+polygon.id);
	  console.log(parentNode);
	  
	  for(let i = 0 ; i < polygon.points.length; i++){		  
		parentNode.append('circle')
				.attr("cx", polygon.points[i].x)
				.attr("cy", polygon.points[i].y)
				.attr('r', 4)
				.attr('fill', 'yellow')
				.attr('stroke', 'black')
				.attr('is-handle', 'true')	
				.attr('class','circle-handler')
				/* .style({cursor: 'move'}) */	
				.call(d3.drag().on("drag",function(){self.handleDrag(this)})) 
	  }
	  
  }
 
 
  updateReader(){
		this.resetHtml();
		var self = this;
		
		d3.select("#g").selectAll('g').selectAll('circle').on("click",function(){self.updatePosReader(this)})
	
	}
 
   /* UPDATE position READER */   
   updatePosReader(circleSelect : any){
	  
	   var self = this;
		//Si on modifie deja un espace on bloque la modif du reader
	   if(this.UpdateSpace){
		   return;
	   }
	  
	  //le circleSelect est identique au dernier reader selectionne donc quitte fct
	   if(this.selectedReader == circleSelect){return;} 
	  
	  var self = this;	//conserver le contexte Angular
	  this.UpdateReader = true; //rendre visible le form html
	  	  
	  //si il y a un reader selectionne et dont la modification n'est pas confirmee, il faut reset ses valeurs (couleurs , ...)
	  if(this.selectedReader){
		 	this.setLastSelectedReaderAtDefaut();
	  }
	  /*on place la pidce du reader et le reader sur le premier par rapport a l'arborescence */
		   var g = circleSelect.parentNode.parentNode;
		 console.log(g);
		 g.appendChild(circleSelect.parentNode);
	  
	  this.selectedReader = circleSelect; // conserve le reader selectionne	  
	  this.spaceIndex = circleSelect.parentNode.id.match(/[0-9]+/g)[0]; //l'index de l'espace dans la tablea des espaces (variable de données)   
	  this.readerIndex = circleSelect.id.match(/[0-9]+/g)[0]; //get l'index du reader selectionne dans listeReaders (variable de données)	
	  this.selectedReader.setAttribute('fill', '#00FE08');//change la couleur du reader selectionne
	  
	  //GARNIT LA VARIABLE D'UPDATE DU READER ***
	  
	   var data_readerSelected = this.currentFloor.listSpaces[this.spaceIndex].listReaders[this.readerIndex];//get les données du reader selcetionne via les index (space,reader)
	   this.readerUpdate.id_space = data_readerSelected.id_space;  //***
	   this.readerUpdate.id_reader = data_readerSelected.id_reader; //***
	   this.readerUpdate.reference = data_readerSelected.reference; //***
	   
	 
	   //ajout event tous les polygons 
			d3.select("#g").selectAll("g").selectAll("polygon").on('click',function(){self.moveReader(this.id)});
	   
	   
	  d3.select(this.selectedReader.parentNode).select("polygon").attr('fill', '#E2C7EA');//set la couleur de la pièce contenant le reader 	  
	  d3.select(circleSelect).call(d3.drag().on("drag",function(){self.dragReader(this)}))//associe event drag au reader selectionne
	  
  }
   
   //set couleurs de base + position par defaut et enelever listener
   setLastSelectedReaderAtDefaut(){
	    var g = this.selectedReader.parentNode;
	   
	    //set couleur de base a l'espace contenant le reader
		  d3.select(g).select("polygon").attr('fill', 'red');
		  
		//remet la couleur par defaut au reader
		  this.selectedReader.setAttribute('fill', '#81DAF5');
		  
	    //on reassocie le reader a son pere de depart ("la piece") 
		  var oldParent = this.selectedReader.parentNode;		
		  var newParent = document.getElementById("g"+this.spaceIndex); // get l'ancien parent pour le relier a celui -ci
		 
			//remove 
			oldParent.removeChild(this.selectedReader);			
			//add 
			newParent.appendChild(this.selectedReader);
			
		//reset position de depart au reader
		  var DefautPostistion = this.currentFloor.listSpaces[this.spaceIndex].listReaders[this.readerIndex]; 		  
		  this.selectedReader.setAttribute('cx',DefautPostistion.x);
		  this.selectedReader.setAttribute('cy',DefautPostistion.y);	
		 
		// remove l'eventlistener (handleDrag du reader)  		
		  d3.select(this.selectedReader).call(d3.drag().on("drag",null));
	   
   }
   
   //Bouton confirmation des changement fait
   ConfirmUpdateReader(){
	   /*//modif sans var intermetiaire
	   var reader = this.currentFloor.listSpaces[this.spaceIndex].listReaders[this.readerIndex];
	   
	   reader.fixed = false;	   
	   reader.x = this.selectedReader.getAttribute('cx');
	   reader.y = this.selectedReader.getAttribute('cy');
	     console.log(reader);*/
		 
	   //garnit notre var d'update (post x, post y, set boolean false)
	   this.readerUpdate.x = this.selectedReader.getAttribute('cx');
	   this.readerUpdate.y = this.selectedReader.getAttribute('cy');
	   this.readerUpdate.fixed = false;
	   
	   //Opere la modification
	   this.readerService.updateReader(this.readerUpdate).subscribe(
			() => {console.log("ok");
			  this.initPage();  },
		  (err:any) => console.error(err) 
		  ); 
		  
		  //retire le formualire, enleve le listener et set les couleurs par defaut
		  this.UpdateReader = false;
		  d3.select(this.selectedReader).call(d3.drag().on("drag",null));
		  d3.select(this.selectedReader.parentNode).select("polygon").attr('fill', 'red');
		  this.selectedReader.setAttribute('fill', '#81DAF5');		  
   }
   
      //handle forme Reader
	dragReader(circleSelect : any){	 
		
		//set la new pos du reader
	   var dragCircle = d3.select(circleSelect), newPoints = [], circle;
		dragCircle
		.attr('cx', d3.event.x)
		.attr('cy', d3.event.y);			
	}
   
    // lie le reader a une autre piece
    moveReader(index : number){
		
		//Set les couleurs de l'ancien (couleur defaut) et du nouveau parent (couleur selection)
		  d3.select(this.selectedReader.parentNode).select("polygon").attr('fill', 'red');	
		  d3.select("#g"+index).select("polygon").attr('fill', '#E2C7EA');	
		
		//Change les parents (D.O.M) du reader
		var oldParent = this.selectedReader.parentNode;		
		var newParent = document.getElementById("g"+index);
		
		//remove 
		  oldParent.removeChild(this.selectedReader);
		
		//add 
		
			//recupere le polygon du nouvel espace pour placer le reader dasn son "périmètre"
		  var polygon = newParent.getElementsByTagName('polygon')[0];			
		  this.selectedReader.setAttribute('cx',polygon.points[0].x);
		  this.selectedReader.setAttribute('cy',polygon.points[0].y);	
		  newParent.appendChild(this.selectedReader)
		
		
		
				   var g = this.selectedReader.parentNode.parentNode;
		 console.log(g);
		 g.appendChild(this.selectedReader.parentNode);

		   // on associe a la variable d'update du reader le nouvel espace
		  this.readerUpdate.id_space = this.currentFloor.listSpaces[index].id_space;	
	}
   
   
   
   //UPDATE SPACE
    //event de mouvoir la polygon d'un espace 
  handleDrag(circleSelect : any) {  
  
    var dragCircle = d3.select(circleSelect), newPoints = [], circle;	
	var circles1 = circleSelect.parentNode.getElementsByClassName("circle-handler");
	var poly1 = circleSelect.parentNode.getElementsByTagName('polygon')[0];
	
    dragCircle
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
	
	//boulce pour recuperer les points du polygon
    for (var i = 0; i < circles1.length; i++) {		
        newPoints.push([circles1[i].cx.baseVal.value, circles1[i].cy.baseVal.value]);		
	}
	
    poly1.setAttribute('points', newPoints);//set la nouvelle forme de l'espace
	
  }  
  
  //permet de definir des cercles (avec listener) sur les points du polygon d'un espace selectionne
  editPolygon(polygon : any){ 
  
	  var gr = polygon.parentNode;
	 
	  var g = d3.select('#gr.id');
		for(var i = 0; i < polygon.points.length; i++) {
		  
			  var circle = g.selectAll('circles')
			.data([polygon.points[i]])
			.enter()
			.append('circle')
			.attr('cx', polygon.points[i][0])
			.attr('cy', polygon.points[i][1])
			.attr('r', 4)
			.attr('fill', '#FDBC07')
			.attr('stroke', '#000')
			.attr('is-handle', 'true')
			.style({cursor: 'move'})
			console.log(circle);
		}			
  }
 

  arrayToSvgPath(arrayPolygon : Array<any>):any{ //il y a 1 erreur lors associe directement 
	 
    var svgPath = new Array();
   
        for (var i = 0; i < arrayPolygon.length; ++i) {
            var point = arrayPolygon[i];
            svgPath.push([arrayPolygon[i].lat, arrayPolygon[i].lng].join(','));
        }                
	  
	  return svgPath;
  }
  
  
    //__ NEW READER __
	
  createNewReader(){	
  
	this.resetHtml();
	this.isANewReader = true;//set visible le form d'ajout
	this.newReader = new Reader(); //var lie au formualire ajout
	
	var self = this;	  
	  
	var g = d3.select('g');
	var gChild = g.selectAll('g').select('polygon')
	/* .on("mouseover",null)
	.on("mouseout",null) */
	.on("click",function(){self.addShapesOfNewReader(this)});//permet d'ajouter un reader lorsqu'on clic sur un espace
		  
  }
    
  //ajout du cercle representant le nouveau reader sur un espace
  addShapesOfNewReader(selected){//selected represnete l'espace sur lequel l'ajout se fait
	  var self = this;
	  
	  /*si le dernier espace selectionne == "nouveau espace" alors quitte
	  if(selected == lastSelected){return;}*/
	  
	  /*si true; cela signifie qu'un reader est dessine (ajout non confirmee) sur un espace
	   il faut donc suppirmer le reader de l'espace*/
	  if(this.lastSelectedSpace)
	  {
		 this.shapeNewReader.remove();
		 
		  this.lastSelectedSpace.setAttribute('fill', 'red');
	  }  
		 
	  
	  selected.setAttribute('fill', '#00FE08');
	  
	  
	 // get le g contenant le selected(polygon) via id == g+index
	  var selectPolygon = d3.select('#g'+selected.id);	 
	
	  var circle = selectPolygon.append('circle')
			.attr('cx', d3.mouse(selected)[0])
			.attr('cy', d3.mouse(selected)[1])
			.attr('r', 4)
			.attr('fill', 'yellow')
			.attr('stroke', 'black')
			.attr('is-handle', 'true')
			.call(d3.drag().on("drag",function(){self.dragReader(this)}))//associe event drag au reader selectionne
       
	   this.shapeNewReader = circle;
			
	   //Associe la pos x,y et id_space à la nouvelle instance Reader		
	  this.newReader.x = d3.mouse(selected)[0];
	  this.newReader.y = d3.mouse(selected)[1];
	  
	 this.newReader.id_space = this.currentFloor.listSpaces[selected.id].id_space; 
	  
	  
	  this.lastSelectedSpace = selected; 
  }
  
  //Confirm AJoutReader
  confirmAddNewReader(){
	
	if(this.newReader.id_space == -1)
	{
		this.errorMessage = "Veuillez sélectionner la pièce à assigner au nouveua reader.";
	}
	else
	{
		this.errorMessage = "";
		this.newReader.x = this.shapeNewReader.attr('cx');
		this.newReader.y = this.shapeNewReader.attr('cy');
		
		
		this.readerService.addReader(this.newReader).subscribe(
			floor => {console.log(floor);
			  this.initPage();  },
		  (err:any) => console.error(err) 
		  ); 
		  this.isANewReader = false; 
		 // d3.select(this.shapeNewReader).call(d3.drag().on("drag",function(){self.dragReader(this)}));//on s'en faout init  svg
	}
	  
  }
    
  
 //__ NEW FLOOR __
 
  createNewFloor(){
	this.resetHtml();
	
	this.newFloor = new Floor(); //variable binder au formaulaire ajout
	this.newFloor.id_building = this.buildingId;
	
  //SI le batiment possede deja un etage, la forme du nouvel etage sera egal celui-ci
	if(this.building_data.listFloor[0])
	{
		this.newFloor.polygon = this.building_data.listFloor[0].polygon;
		this.drawFloor(this.newFloor);// dessiner le nouvel etage
	}
	else// uniquement pour le premier étage d'un batiment
	{	
		/*methode permet de recupere la forme du batiment en appliquant le 0.0 du svg 
		  et non le 0.0 du viewBox(== user system coordinates)*/
	   this.newFloor.polygon = this.getCoordinatesWithoutConsideringViewBox();
	}	
	this.isANewFloor = true;
  }
  
  //bouton confirmation de l'ajout etage
	confirmAddNewFloor(){
		this.isANewFloor = false;
		
		  this.floorService.addFloor(this.newFloor).subscribe(
			floor => {console.log('create new floor'+floor);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  );  
	}
		
	
   //__ NEW SPACE __
   
   //bouton confirmation ajout space
	confirmAddNewSpace(){		
		  if(!this.formeSpace){	//si pas de aucune forme dessinée alors erreur	  
			  this.errorMessage = "Veuillez tracer la forme de l'espace";
		  }
		  else
		  {
				this.errorMessage = "";	
				this.newSpace.polygon = this.pointsPolygon; 
				this.newSpace.id_floor = this.floorId;
								
				this.spaceService.addSpace(this.newSpace).subscribe(
					floor => {console.log('create new floor'+floor); this.initPage();},
					(err:any) => console.error(err) 
				); 
		        this.pointsPolygon.splice(0);
				this.isANewSpace = false;
		  }
	}
  
  
   // go bac retourner page precedente
  goBack(): void {
  this.location.back();
  }
 
  /*LOrs de la premiere creation d'un etage, on get les coordonnes du polygon en supprimant la viewBox 
  et considerer les points par rapport au 0.0 */
getCoordinatesWithoutConsideringViewBox():Array<any>{
	
	
	var x = this.svgNoeud;	
	var viewPortWidth = x.width.baseVal.value;
	var viewPortHeigth = x.height.baseVal.value;
	
	console.log(x);
	
	var polygon = x.getElementsByTagName("polygon")[0];
	var viewbox = x.viewBox.baseVal;	
	

	var trueWidth = viewPortWidth/viewbox.width;	
	var trueHeigth = viewPortHeigth/viewbox.height;
	
	console.log(viewPortHeigth);
	var tabPolygon = new Array();
	
	for (let i = 0; i < polygon.points.length; i++ )
	{
		let obj = {};
		obj["lat"]= (polygon.points[i].x - viewbox.x )*trueWidth;
		obj["lng"] = (polygon.points[i].y - viewbox.y )*trueHeigth;
		 console.log(obj); 
		tabPolygon.push(obj);
	}
	console.log(tabPolygon);
	return tabPolygon;	
}



/* METHODE TRACAGE POLYGON EN SVG A PARTIR DE COORDONNES LATLNG de GOOGLE MAP
		CONVERSION GOOGLE MAPS TO SVG */

 latLng2point(latLng) {

    return {
        x: (latLng.lng + 180) * (256 / 360),
        y: (256 / 2) - (256 * Math.log(Math.tan((Math.PI / 4) + ((latLng.lat * Math.PI / 180) / 2))) / (2 * Math.PI))
    };
}

 poly_gm2svg(gmPath, fx) {

    var point;   
    var svgPath = new Array();
    var minX = 256;
    var minY = 256;
    var maxX = 0;
    var maxY = 0;

        for (var p = 0; p < gmPath.length; ++p) {
            point = this.latLng2point(fx(gmPath[p]));
            minX = Math.min(minX, point.x);
            minY = Math.min(minY, point.y);
            maxX = Math.max(maxX, point.x);
            maxY = Math.max(maxY, point.y);
            svgPath.push([point.x, point.y].join(','));
			console.log(point.x+" "+point.y);
        }

    return {
        path:  svgPath,
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };

}

 drawPoly(node, props) {

   var svg = node.cloneNode(false);
   node.parentNode.replaceChild(svg, node);
	
   var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');      
		
	var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
	
		
	polygon.setAttribute("points", props.path);
	polygon.setAttribute('id', 'poly');
    
	g.appendChild(polygon);
    g.setAttribute("id","g"); 
    svg.appendChild(polygon);	
	svg.setAttribute('viewBox', [props.x, props.y, props.width, props.height].join(' '));		
}

 init() {    

    var svgProps = this.poly_gm2svg(this.building_data.polygon, function (latLng) {
        return {
            lat: latLng.lat,
            lng: latLng.lng
        }
    });
	var node = this.svgRef;
	var noued = document.getElementById("svg");
    this.drawPoly(noued, svgProps);
	this.svgNoeud = document.getElementById('svg');
}

/* -- FIN METHODE CONVERSION GOOGLE-MAPS TO SVG -- */


/*METHODE DRAW POLYGON ON SVG*/

//__ NEW SPACE __

drawOnSvg(){
	this.resetHtml();
	
	this.svg = d3.select("g");
	
	var svg = 	this.svg;	//svgNoeuder si retire
	this.formeSpace = null;
	this.isANewSpace = true;
	this.newSpace = new Space();
	
	
	
    var self = this; /* conserver le contexte angular pour pouvoir travailler sur ses variables et/ou faire appel à ses fonctions */
	var dragging = false, startPoint;		
	var points = [];
	var g;

  this.svg.on('mouseup', function(){ /*perte du contexte angular - d'ou utilité du self*/
	
	console.log(this);
	console.log("method creation");  	
    self.drawing = true;
	
	
    startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
	console.log(d3.mouse(this)[0]+ ", "+d3.mouse(this)[1]);
    if(svg.select('g.drawPoly').empty()) g = svg.append('g').attr('class', 'drawPoly');
	
	console.log(d3.event.target);
    if(d3.event.target.hasAttribute('is-handle')) {
		self.pointsPolygon = points;
		console.log(self.pointsPolygon);
		self.closePolygon();
        return;
    };
	
    points.push(d3.mouse(this));
	console.log("GET points");console.log(points);
	
    g.select('polyline').remove();
    var polyline = g.append('polyline').attr('points', points)
                    .style('fill', 'none')
                    .attr('stroke', '#000000')
					
    for(var i = 0; i < points.length; i++) {
        g.append('circle')
        .attr('cx', points[i][0])
        .attr('cy', points[i][1])
        .attr('r', 4)
        .attr('fill', 'yellow')
        .attr('stroke', '#000')
        .attr('is-handle', 'true')
        .style({cursor: 'pointer'});
    }
});

this.svg.on('mousemove',  function() {
	console.log("method mouse");
    if(!self.drawing) return;
    var g = d3.select('g,drawPoly');
 g.select('line').remove();
    var line = g.append('line')
                .attr('x1', startPoint[0])
                .attr('y1', startPoint[1])
                .attr('x2', d3.mouse(this)[0] + 2)
                .attr('y2', d3.mouse(this)[1])
                .attr('stroke', '#53DBF3');
})

	
	console.log("fin methode drawing"); 
}


  closePolygon() {
	  console.log("close");  
	  this.formeSpace = this.pointsPolygon;
	 this.svg.select('g.drawPoly').remove();
    var g = this.svg.append('g');
    g.append('polygon')
    .attr('points', this.pointsPolygon)
    .style('fill', this.getRandomColor());
		
		
	/*Pour tous les points du polygons du batiments dessiner un cercle qui permettre la modif de la forme*/
	
    for(var i = 0; i < this.pointsPolygon.length; i++) {
        var circle = g.selectAll('circles')
        .data([this.pointsPolygon[i]])
        .enter()
        .append('circle')
        .attr('cx', this.pointsPolygon[i][0])
        .attr('cy', this.pointsPolygon[i][1])
        .attr('r', 4)
        .attr('fill', '#FDBC07')
        .attr('stroke', '#000')
        .attr('is-handle', 'true')
        .style({cursor: 'move'})
        //,call(dragger);
    }
	   
    this.drawing = false;
	this.svg.on('mousemove', null);
	this.svg.on('mouseup',null); 	
	//propose dernier ajustement
}

   getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
  
}
