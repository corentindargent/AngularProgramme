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
  test: any;
  
  private building_data : Building;
  private buildingId : number;
  private currentFloor : Floor;
  private selectedSpace : any = null;
  basicView : boolean;//affiche form html
  
  //VAR DRAWNG SVG
  pointsPolygon : Array<any>;
  drawing : boolean = false;
  
 
  
  
  
  //VAR - CREATE NEW FLOOR/SPACE
  
  @Input() newFloor : Floor; 
  isANewFloor : boolean = false; //affiche form html
  
  @Input() newSpace : Space;  
  isANewSpace : boolean = false; //affiche form html
  errorMessage : string;
  formeSpace : Array<any>;
  floorId : number;  
  
  @Input() newReader : Reader;
  isANewReader : boolean = false; //affiche form html
  
  //VAR - CREATE NEW READER
	lastSelectedSpace  : any;
   
  //VAR - MODIFICATION SPACES
  
  UpdateSpace : boolean = false;
  

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
	  console.log(this.buildingId);
	 this.buildingService.getDataOfABuild(this.buildingId)
    .subscribe(
		(building : Building )  => {
			this.building_data = building;
			console.log(this.building_data);
			//if(this.building_data.listFloor[0]){this.isThereAFloor = true;}			
			
			this.test = document.getElementById('svg');
			this.initPolygon();
		},
		(err:any) => {console.error(err); console.log(err.body)}
	);
	  
  }
  
  
  /*A changer/ modifier --
			pour le moment permet de garder coherent HTML ne pas avoir tous les formulaires d'ajout de nouvel element à la fois
			et retire les events lies a la creation de telles ou telles instances 
  */
  resetHtml(){
	
	var g = d3.select('g');//get le 1st g comprenant la forme de l'étage
	var gChild = g.selectAll('g');//get tous les g (où un g == 1 space) de c comprenant la forme de l'étage
	gChild.select('polygon').on('click',null);
	
	this.isANewReader = false;
	
	if(this.basicView){
		
	  gChild.on("mouseover",null)
			.on("mouseout",null)
			.on("click",null);
		this.basicView = false;
	}
	
	if(this.isANewSpace) {
		this.isANewSpace = false;
		g.on("mouseup",null)
		g.on("mousemove",null);
	}
	
	
	if(this.isANewFloor){
	  this.isANewFloor = false;
	  this.drawFloor(this.building_data.listFloor[0]);
	}
	
	if(this.UpdateSpace)
	{
		if(this.selectedSpace)//si qq chose stocke, set le dernier selectionner a defaut
		{
			var index = this.selectedSpace.id;
			this.selectedSpace.setAttribute('fill', 'red');
			
			var circles = d3.select("#g"+index).selectAll('circle.circle-handler');//pour recupere uniqument les cerlces du polygon qui ne sont pas des readers 
			circles.remove();
			this.selectedSpace.setAttribute("points",this.ArrayToSvgPath(this.currentFloor.listSpaces[index].polygon));
		}
		this.UpdateSpace = false;
	}
	
  }
  
  initPolygon(){
	  
		if(this.building_data.listFloor[0])
		{
			// ETAGE EXISTANT
			console.log(this.building_data.listFloor[0]);
			this.drawFloor(this.building_data.listFloor[0]);
		}
		else
		{
			console.log("Premiere fois ici");
			this.init();					
		} 
  }
  
  // LORS CE QU4IL AURA DES ETAGES VOIR COMMENT LE SINTEGRE SVG
  drawFloor(floor : Floor)
  {	 	  
	//ajout - ACTIVation BOUTON CREATION ESPACE
	  this.currentFloor = floor;
	  this.floorId = floor.id_floor;
	  console.log("Current Floor "+ floor.id_floor);
	
	  
	  var svg = d3.select('svg');
	  //retire le g et ses enfants de l'arborescence
	  var g = svg.select('g');
	  g.remove();
	  
	  
	    //version d3
 var g =  svg.append('g').attr('id', 'g');
 
 
 var polygon = g.append('polygon')
		.attr('id', 'poly')
		.attr('stroke', 'black')
		.attr('stroke-width', '4')
		.attr('fill', 'white')
		.attr('stroke', 'black')
		.attr("points", this.ArrayToSvgPath(floor.polygon))
 
	    /* POLYGON espaces */
	   //var g_spaces = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
	   
	   var self =this;	 
	   self.basicView = true;  
	  floor.listSpaces.forEach(function(element,index)
	   {
		  
		   var g_space = g.append('g')
				.attr('id', "g"+index);
				
			var polygonSpace = g_space.append('polygon')
				.attr("points", self.ArrayToSvgPath(element.polygon))
				.attr('id', ""+index)
				.attr('stroke-width', '2')
				.attr('stroke', 'black')
				.attr('fill', 'red')
				//.on("mouseover",function(){this.setAttribute('fill', '#00FE08');self.selectedSpace = this.id; })
				//.on("mouseout",function(){this.setAttribute('fill', 'red');self.selectedSpace = null;})
				.on('click',function(){self.editShapesOfSpace(this)})
				
				element.listReaders.forEach(function(element,index)
				{
					  
					   console.log(element);
					  
							
						var circle = g_space.append('circle')
							.attr("cx", element.x)
							.attr("cy", element.y)
							.attr('r', 4)
							.attr('fill', '#81DAF5')
							.attr('stroke', 'black')
							.attr('is-handle', 'true')
							.on('click',function(){alert("Modifier la position du reader");})
				   
				});
	   
	   });
	 
  }
  
  
  updateSpaces(){
	  this.resetHtml();
	  var self = this;
	 var g = d3.select('g');//get le 1st g comprenant la forme de l'étage
	 var gChild = g.selectAll('g');//get tous les g comprenant les espaces
	  gChild.selectAll('polygon').on('click',function(){self.editShapesOfSpace(this)})
  }
  
  ConfirmUpdateSpace(){
	  
	  //garnit l'espace modifie en rajoutant le polygon, la posX et la posY.
	  var espaceModifier = this.currentFloor.listSpaces[this.selectedSpace.id];
	 
	  
	  espaceModifier.polygon = this.selectedSpace.points;
	  espaceModifier.x = this.selectedSpace.points[0].x;
	  espaceModifier.y = this.selectedSpace.points[0].y;
	  
	  
	  
	  this.spaceService.updateSpace(espaceModifier).subscribe(
			floor => {console.log('create new floor'+floor);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  ); 
		  
	  this.UpdateSpace = false;
	}
  
  
  //modifier forme de l'espace selectionné
  
  editShapesOfSpace(polygon : any)
  {  
  this.UpdateSpace = true;
	 if(this.selectedSpace)//si qq chose stocke, set le dernier selectionner a defaut
	 {
		var index = this.selectedSpace.id;
		this.selectedSpace.setAttribute('fill', 'red');
		
		var circles = d3.select("#g"+index).selectAll('circle.circle-handler');//pour recupere uniqument les cerlces du polygon qui ne sont pas des readers 
		circles.remove();
		this.selectedSpace.setAttribute("points",this.ArrayToSvgPath(this.currentFloor.listSpaces[index].polygon));
	 }
	 
	this.selectedSpace = polygon;
	this.selectedSpace.setAttribute('fill', '#00FE08');
  
      console.log(polygon.id);
	  var self = this;
	  
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
  //  METHODE MODIFICATION FORME  POLYGON VERISON ORIGINAL   (tous en d3.js)
  /* handleDrag(selected : any){
	  console.log(selected);
    var dragCircle = d3.select(selected), newPoints = [], circle;
    
    var poly = d3.select(selected.parentNode).select('polygon');
    var circles = d3.select(selected.parentNode).selectAll('circle');
    console.log(circles);
	
	dragCircle
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
	
    for (var i = 0; i < circles[0].length; i++) {
        circle = d3.select(circles[0][i]);
        newPoints.push([circle.attr('cx'), circle.attr('cy')]);
    }
	
    poly.attr('points', newPoints);	  
  } */
  
  
   // *** Probleme avec selectAll de d3.js (aucun array en sortie)
	// Donc la partie recueprant les cercles a ete fait en DOM traditionel et non d3.js   
	
	dragger : any = d3.drag()
    .on('drag', function handleDrag() { 
	
    var dragCircle = d3.select(this), newPoints = [], circle;
	
	var circles1 =this.parentNode.getElementsByTagName("circle");
	var poly1 = this.parentNode.getElementsByTagName('polygon')[0];
	
    dragCircle
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
	
	
    for (var i = 0; i < circles1.length; i++) {
		
        newPoints.push([circles1[i].cx.baseVal.value, circles1[i].cy.baseVal.value]);		
	}	
    poly1.setAttribute('points', newPoints);
	
   });
   
  handleDrag(circleSelect : any) {    
    var dragCircle = d3.select(circleSelect), newPoints = [], circle;
	
	var circles1 = circleSelect.parentNode.getElementsByClassName("circle-handler");
	var poly1 = circleSelect.parentNode.getElementsByTagName('polygon')[0];
	
    dragCircle
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
	
	
    for (var i = 0; i < circles1.length; i++) {
		
        newPoints.push([circles1[i].cx.baseVal.value, circles1[i].cy.baseVal.value]);		
	}	
    poly1.setAttribute('points', newPoints);
	
   }
  
  
  
  
  
  editPolygon(polygon : any)
  { 
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
			//.call(dragger);	***		
			console.log(circle);
		}		
			
  }
  
  
  ArrayToSvgPath(arrayPolygon : Array<any>):any{ //il y a 1 erreur lors associe directement 
	 
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
	this.isANewReader = true;
	this.newReader = new Reader(); //var lie au formualire ajout
	var self = this;
	  
	  
	var g = d3.select('g');
	var gChild = g.selectAll('g').select('polygon')
	.on("mouseover",null)
	.on("mouseout",null)
	.on("click",function(){self.addShapesOfNewReader(this)});
		  
  }
  
  
  //ajout du cercle representant le nouveau reader
  addShapesOfNewReader(selected){
	  
	  if(this.lastSelectedSpace)
	  {
		  this.lastSelectedSpace.setAttribute('fill', 'red');
		  var lastSelected = d3.select('#g'+this.lastSelectedSpace.id).select('circle');
		  lastSelected.remove();
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
			
	   //Associe la pos x,y et id_space à la nouvelle instance Reader		
	  this.newReader.x = d3.mouse(selected)[0];
	  this.newReader.y = d3.mouse(selected)[1];
	  this.newReader.id_space = this.currentFloor.listSpaces[selected.id].id_space; 
	  
	  
	  this.lastSelectedSpace = selected; 
  }
  
  
  addNewReader(){
	
	if(this.newReader.id_space == -1)
	{
		this.errorMessage = "Veuillez sélectionner la pièce à assigner au nouveua reader.";
	}
	else
	{
		this.errorMessage = "";
		console.log(this.newReader);
		
		this.readerService.addReader(this.newReader).subscribe(
			floor => {console.log(floor);
			  this.initPage();  },
		  (err:any) => console.error(err) 
		  ); 
	}
	  
  }
  
  
 //__ NEW FLOOR __
 
  createNewFloor(){
	this.resetHtml();
	
	this.newFloor = new Floor();
	this.newFloor.id_building = this.buildingId;
	
	if(this.building_data.listFloor[0])// si le batiment possede un etage, alors on set la forme du noueavu à un exsitant
	{
		this.newFloor.polygon = this.building_data.listFloor[0].polygon;
		this.drawFloor(this.newFloor);// dessiner le nouvel etage
		console.log(this.newFloor.polygon[0]);
	}
	else// uniquement pour le premier étage d'un batiment
	{
		console.log("Le batiment ne possède pas encore d'etage");
		console.log(this.building_data.listFloor[0]);		
		
		this.newFloor.polygon = this.getCoordinatesWithoutConsideringViewBox();
	}	
	this.isANewFloor = true;
  }
  

  
    addNewFloor(){
		this.isANewFloor = false;
		
		  this.floorService.addFloor(this.newFloor).subscribe(
			floor => {console.log('create new floor'+floor);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  ); 
		  		 
	}
	
	
   //__ NEW SPACE __
	addNewSpace(){
		
		  if(!this.formeSpace ){
			  
			  this.errorMessage = "Veuillez tracer la forme de l'espace";
		  }
		  else
		  {
			  console.log("ADD");
			
				this.errorMessage = "";	
					this.newSpace.polygon = this.pointsPolygon; 
					this.newSpace.id_floor = this.floorId;
					console.log(this.newSpace);
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
	
	
	var x = this.test;	
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



/* METHODE TRACAGE POLYGON EN SVG A PARTIR DE COORDONNES LATLNG de GOOGLE MAP */

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
	this.test = document.getElementById('svg');
}






/*METHODE DRAW POLYGON ON SVG*/

//__ NEW SPACE __

drawOnSvg(){
	this.resetHtml();
	
	this.svg = d3.select("g");
	
	var svg = 	this.svg;	//tester si retire
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
