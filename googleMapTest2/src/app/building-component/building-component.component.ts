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
  
  private building_data : Building = new Building();
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
  isANewReader : boolean = false;

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
	  
	  console.log(this.buildingId);
	 this.buildingService.getDataOfABuild(this.buildingId )
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
	//*ajout - ACTIVation BOUTON CREATION ESPACE
	  this.currentFloor = floor;
	  var svg = this.test;
	  svg.removeChild(svg.firstChild);
	  
	  //apres avoir creer etages on recharge la map, il peut encore y avoir la viewBox 
	  svg.setAttribute("viewBox",null);
	  
	  this.floorId = floor.id_floor;	
	  //this.currentFloor = index;
	  
	  
	 
	  /* POLYGON ETAGES */
	  var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');     
	  var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
	  
	  
	  
	   polygon.setAttribute("points", this.ArrayToSvgPath(floor.polygon));
	   polygon.setAttribute('id', 'poly');
	   polygon.setAttribute('stroke', 'black');
	   polygon.setAttribute('stroke-width', '4');
	   polygon.setAttribute('fill', 'white');
	   g.appendChild(polygon);
	   g.setAttribute("id","g"); 
	   
	    /* POLYGON espaces */
	   //var g_spaces = document.createElementNS("http://www.w3.org/2000/svg", 'g');  
	   
	   var self =this;	   
	  floor.listSpaces.forEach(function(element,index)
	   {
		   self.basicView = true;
		   
		   let g_space = document.createElementNS("http://www.w3.org/2000/svg", 'g'); 
		   let polygonSpace = document.createElementNS('http://www.w3.org/2000/svg','polygon');
		   polygonSpace.setAttribute("points", self.ArrayToSvgPath(element.polygon));
			polygonSpace.setAttribute('id', ""+index);
			 polygonSpace.setAttribute('stroke', 'black');
			polygonSpace.setAttribute('stroke-width', '2');
			polygonSpace.setAttribute('fill', 'red'); 
			
			polygonSpace.addEventListener("mouseover",function(){this.setAttribute('fill', '#00FE08');self.selectedSpace = this.id; })
			polygonSpace.addEventListener("mouseout",function(){this.setAttribute('fill', 'red');self.selectedSpace =null;})
			//polygonSpace.addEventListener("click",function(){self.editPolygon(this);})	
			
			g_space.appendChild(polygonSpace);
			g_space.setAttribute('id',""+index);
			g.appendChild(g_space);
	   });
		
	   svg.appendChild(g);	
	  	  
  }
  
  
  /*   *** A travailler dessus behavior not assecible
	dragger : any = d3.behavior.drag()
    .on('drag', function handleDrag() {
    
    var dragCircle = d3.select(this), newPoints = [], circle;
    
    var poly = d3.select(this.parentNode).select('polygon');
    var circles = d3.select(this.parentNode).selectAll('circle');
    dragCircle
    .attr('cx', d3.event.x)
    .attr('cy', d3.event.y);
    for (var i = 0; i < circles[0].length; i++) {
        circle = d3.select(circles[0][i]);
        newPoints.push([circle.attr('cx'), circle.attr('cy')]);
    }
    poly.attr('points', newPoints);
   }); */
  
  
  editPolygon(polygon : any)
  { 
	  var gr = polygon.parentNode;
	  console.log(polygon);
	  console.log(gr.id);
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
		}		
			
  }
  
  
    
  
  
  
  ArrayToSvgPath(arrayPolygon : Array<any>):any{
	 
    var svgPath = new Array();
   
        for (var i = 0; i < arrayPolygon.length; ++i) {
            var point = arrayPolygon[i];
            svgPath.push([arrayPolygon[i].lat, arrayPolygon[i].lng].join(','));
        }                 
	  
	  return svgPath;
  }
  
  
  /*init variable pour formaulire new floor + set boolean à true pour render visible formualire*/
  
  
  
  createNewReader(){
	this.basicView = false;
	this.isANewReader = true;
	
	this.newReader = new Reader();
	var self = this;
	
/* 	js
	var g = this.test.firstChild;
	var gChild = g.getElementsByTagNameNS("http://www.w3.org/2000/svg","g");
	
	
	
		for(let i = 0; i < gChild.length ; i++){	
		
		   
		   var polyChild = gChild[i].getElementsByTagNameNS("http://www.w3.org/2000/svg","polygon");
		   
		   for(let  i = 0; i < polyChild.length; i++)
		   {
			   polyChild[i].removeListener("mouseover");
			   polyChild[i].removeListener("mouseout");
			   polyChild[i].addEventListener("click",function(){console.log("Coucou clic !")});

		   }			
			
		} 	  */
	  
	  
	var g = d3.select('g');
	var gChild = g.selectAll('g').select('polygon')
	.on("mouseover",null)
	.on("mouseout",null)
	.on("click",function(){console.log("Coucou clic !")});
	
	  
  }
  
  
 
  
  createNewFloor(){
	  this.basicView = false;
	this.newFloor = new Floor();
	this.newFloor.id_building = this.buildingId;
	
	if(this.building_data.listFloor[0])// si il exsite un etage on set la forme du noueavu à celui exsitant
	{
		console.log("Le batiment possède deja un etage");
		this.newFloor.polygon = this.building_data.listFloor[0].polygon;
		this.drawFloor(this.newFloor);
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
		console.log(this.newFloor);
		  this.floorService.addFloor(this.newFloor).subscribe(
			floor => {console.log('create new floor'+floor);
			 this.initPage(); },
		  (err:any) => console.error(err) 
		  ); 
		  
		 
	}
	
	
  
	addNewSpace(){
		this.basicView = false;
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
					floor => {console.log('create new floor'+floor);},
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



/* METHODE TRACAGE POLYGON EN SVG A PARTIR DE COORDONNES LATLNG (GOOGLE MAP) */

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





drawOnSvg(){
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
