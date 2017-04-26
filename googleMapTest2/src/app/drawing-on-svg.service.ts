import { Injectable } from '@angular/core';
import * as d3 from 'd3';

@Injectable()
export class DrawingOnSvgService {

  dragging : boolean = false;
  drawing : boolean = false;
  startPoint : Array<any> = new Array();
  svg :any;
  points : Array<any> = new Array();
  g : any;
  
  constructor() {
	  this.svg = d3.select('#svg');
   }
   
   init(/*envoyer le noeud svg*/svg:any){
	   console.log("yo");
	   console.log(svg._groups);
	   this.svg = svg;
	   
	   svg.on('mouseup', function(){
    if(this.dragging) return;
    this.drawing = true;
    this.startPoint = [d3.mouse(this)[0], d3.mouse(this)[1]];
	console.log(d3.mouse(this)[0]+ ", "+d3.mouse(this)[1]);
    if(svg.select('g.drawPoly').empty()) this.g = svg.append('g').attr('class', 'drawPoly');
	console.log(d3.event.target);
    if(d3.event.target.hasAttribute('is-handle')) {
        //closePolygon();
        return;
    };
    this.points.push(d3.mouse(this));
    this.g.select('polyline').remove();
    var polyline = this.g.append('polyline').attr('points', this.points)
                    .style('fill', 'none')
                    .attr('stroke', '#000');
					
    for(var i = 0; i < this.points.length; i++) {
        this.g.append('circle')
        .attr('cx', this.points[i][0])
        .attr('cy', this.points[i][1])
        .attr('r', 4)
        .attr('fill', 'yellow')
        .attr('stroke', '#000')
        .attr('is-handle', 'true')
        .style({cursor: 'pointer'});
    }
});
	   
	   
	   
	   
   }
   

}
