import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { ActivatedRoute, Params }   from '@angular/router';
import 'rxjs/add/operator/switchMap';
import { Location }                 from '@angular/common';
 
import { BuildingService } from '../building.service';
import { Building } from '../model'

@Component({
  selector: 'building-component',
  templateUrl: './building-component.component.html',
  styleUrls: ['./building-component.component.css']
})
export class BuildingComponent implements OnInit {

  building_data : Building = new Building();
  @ViewChild('svg') svgRef: ElementRef;
  

  constructor(private route : ActivatedRoute, private location: Location, private buildingService: BuildingService ) 
  {}

  ngOnInit() {
	  console.log("FENETRE BUILDING");
	 console.log(this.route.params);
	 this.route.params.switchMap((params: Params) => this.buildingService.getDataOfABuild(+params['id']))
    .subscribe(
		(building : Building )  => {
			this.building_data = building;
			this.init();
		},
		(err:any) => {console.error(err); console.log(err.body)}
	);
	
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

 drawPoly(node, props) {

    var svg = node.cloneNode(false);
    var g = document.createElementNS("http://www.w3.org/2000/svg", 'g');       
		
	var polygon = document.createElementNS('http://www.w3.org/2000/svg','polygon');
	polygon.setAttribute("points", props.path);
	polygon.setAttribute("id", "idPoly");
	
    node.parentNode.replaceChild(svg, node);
		
	svg.setAttribute('viewBox', [props.x, props.y, props.width, props.height].join(' '));	
	
    
   /*  g.setAttribute("id","idG");  
	g.appendChild(polygon); */
	
    svg.appendChild(polygon);
	svg.setAttribute('id', 'svgId');

   



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



  
  
  

}
