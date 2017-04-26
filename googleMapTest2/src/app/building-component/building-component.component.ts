import { Component, OnInit, ViewChild, ElementRef,Input } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Location }                 from '@angular/common';
 

 
import { BuildingService } from '../building.service';
import { DrawingOnSvgService }  from '../drawing-on-svg.service';
import { Building,Floor } from '../model'
import * as d3 from 'd3';

@Component({
  selector: 'building-component',
  templateUrl: './building-component.component.html',
  styleUrls: ['./building-component.component.css']
})
export class BuildingComponent implements OnInit {

  building_data : Building = new Building();
  @ViewChild('svg') svgRef: ElementRef;
  svg :any;
  test: any;
  pointsPolygon : Array<any>;
  drawing : boolean = false;
  isThereAFloor : boolean = false;
  
  
  //var creation new elements
  @Input() newFloor : Floor; 
  isANewFloor : boolean = false;
  
  
  
  

  constructor(private route : ActivatedRoute, private location: Location, private buildingService: BuildingService, private  drawingSvgService : DrawingOnSvgService) 
  {}

  ngOnInit() {
	  console.log("FENETRE BUILDING");
	 console.log(this.route.params);
	 this.route.params.switchMap((params: Params) => this.buildingService.getDataOfABuild(+params['id']))
    .subscribe(
		(building : Building )  => {
			this.building_data = building;
			if(this.building_data.listFloor[0]){this.isThereAFloor = true;}
			this.init();
			this.svg = d3.select('svg');
			this.test = document.getElementById('svg');
		},
		(err:any) => {console.error(err); console.log(err.body)}
	);
	
  }
  
  
  
  /*init variable pour formaulire new floor + set boolean à true pour render visible formualire*/
  
  createNewFloor(){
	this.newFloor = new Floor();
	
	if(this.building_data.listFloor[0])// si il exsite un etage on set la forme du noueavu à celui exsitant
	{
		console.log("Le batiment possède deja un etage");
		this.newFloor.polygon = this.building_data.listFloor[0].polygon;
	}
	else
	{
		console.log("Le batiment ne possède pas encore d'etage");
		console.log(this.building_data.listFloor[0]);
		var tabPolygon = this.getCoordinatesWithoutConsideringViewBox();
	}
	  
  }
  
  // go bac retourner page precedente
  goBack(): void {
  this.location.back();
  }
  

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
        }


       
	   
    return {
        path:  svgPath,
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };

}


getCoordinatesWithoutConsideringViewBox():Array<any>{
	
	var x = this.test;
	console.log("SVG");
	console.log(x);
	console.log("SVG width");
	console.log(x.width.baseVal.value);
	//var x = document.getElementById("svg"); var polygon = x.getElementsByTagNameNS('http://www.w3.org/2000/svg',"polygon");
	
	var polygon = x.getElementsByTagName("polygon")[0];
	var viewbox = x.viewBox.baseVal;
	console.log("viewbox");
	console.log(viewbox.width);
	
	var viewPortWidth = x.width.baseVal.value;
	var viewPortHeigth = x.height.baseVal.value;

	var trueWidth = viewPortWidth/viewbox.width;
	
	
	var trueHeigth = viewPortHeigth/viewbox.height;
	
	console.log(trueWidth);
	console.log(trueHeigth);
	console.log(viewbox.x);
	console.log(viewbox.y);
	
	var tabPolygon = polygon.points;
	var tabS = polygon.points;
	var indiceX, indiceY ;
	//var 
	
	/*tab ser à rein directemetn retier les valeurs
	//set à 0 le x et y 
	for (let i = 0; i < polygon.points.length; i++ )
	{
		if(polygon.points[i].x == viewbox.x )
		{
			console.log(tabPolygon[i].x+" "+viewbox.x);
			indiceX=i;
		}
		
		if(polygon.points[i].y == viewbox.y)
		{
			console.log(tabPolygon[i].y+" "+viewbox.y);
			indiceY=i;
		}
	}*/
	
	for (let i = 0; i < polygon.points.length; i++ )
	{
		console.log("Calcul coordonnées "+i);
		console.log(polygon.points[i].x +" -  "+ viewbox.x +" = ");console.log( polygon.points[i].x - viewbox.x);
		console.log(polygon.points[i].y +" - "+ viewbox.y+ " = ");console.log( polygon.points[i].y - viewbox.y);
		console.log("/n");
		tabPolygon[i].x = (polygon.points[i].x - viewbox.x )*trueWidth;
		tabPolygon[i].y = (polygon.points[i].y - viewbox.y )*trueHeigth;
		
		//console.log(tabPolygon[i].x +" "+tabPolygon[i].y);
	}
	
	return tabPolygon;
	
	
	
	/*
		height="500"  width="500" 
		viewBox="131,2897702852788 86,08866119384766 0,00032806396484375 0,0003757476806640625"
		
		131,2897702852788   86,0887565612793
		131,289945761353  86,08866119384766
		131,29009834924364	86,0889377593994
		131,28992096582078	86,08903694152832 	
		
		
		
		
		
		
		truewid = 500/0,00032806396484375 = 1524093,0232558139534883720930233
		
		true 500/0,0003757476806640625 = 1330680,2030456852791878172588832
		
		131,2897702852788,86,0887565612793
		131,289945761353,86,08866119384766
		131,29009834924364,86,0889377593994
		131,28992096582078,86,08903694152832 	
		
						<=>
						
		0             ,0,00009536743164
		0,0001754760742              , 0
		0,00032806396484              ,	0,00027656555174
		0,00015068054198              ,	0,00037574768066

						<=>
		0                             126,90355329866071065989847715736
267,44186043653953488372093023256		0
	499,99999999428465116279069767442	 368,02030454482517766497461928934
	229,65116277212279069767441860465 499,9999999945941116751269035533
//x.width.baseVal ;x.height.baseVal 
	
	//polygon,points litse de points 
	
	//
	
	//getTransformToElement
	
	*/
	
	
	
}

 drawPoly(node, props) {
	 



   var svg = node.cloneNode(true);
    node.parentNode.replaceChild(svg, node);
	
   var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');      
		
	var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
	
		
	polygon.setAttribute("points", props.path);
	polygon.setAttribute('id', 'poly');
    
	g.appendChild(polygon);
    g.setAttribute("id","idG"); 
    svg.appendChild(polygon);
	
	//svg,appendChild(polygon);
	//svg,setAttribute('id', 'svgId');
	svg.setAttribute('viewBox', [props.x, props.y, props.width, props.height].join(' '));	
	
	// d3.js
 /*var svg = d3.select("#svg");
	 var g = svg.append('g').attr('id','svgId');
	g.append('polygon').attr('points',props.path);
	svg.append('polygon').attr('points',props.path);
	svg.attr('viewBox', [props.x, props.y, props.width, props.height].join(' '));
	 */
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
}

bouh(){console.log('bouh');console.log(this.drawing);}

draw(){
	
	this.drawOnSvg(this.closePolygon);
}


drawOnSvg(closePolygon){
	
	console.log(this);	
	var dragging = false, startPoint;
	var svg = 	this.svg;
    var self = this; /* garde contexet angular pour travailler sur les variables et faire appel au fonction */
	var points = [];
	var g;

this.svg.on('mouseup', function(){ /*perte du contexte angular - d'ou utilité du self*/
	
	console.log(this);
	console.log("method creation");  	
    self.drawing = true;
	self.bouh();
	
    startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
	console.log(d3.mouse(this)[0]+ ", "+d3.mouse(this)[1]);
    if(svg.select('g,drawPoly').empty()) g = svg.append('g').attr('class', 'drawPoly');
	
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
 
	  this.svg.select('g,drawPoly').remove();
    var g = this.svg.append('g');
    g.append('polygon')
    .attr('points', this.pointsPolygon)
    .style('fill', this.getRandomColor());
		console.log(this.pointsPolygon);

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
    this.pointsPolygon.splice(0);
    this.drawing = false;
	
	console.log("\n\n\n\n NEW CREATOIOn");
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
