import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RoutingModule} from './route-module/routing.module';


import { AppComponent } from './app.component';
import { GoogleMapComponentComponent } from './google-map-component/google-map-component.component';
import {BuildingComponent} from './building-component/building-component.component';


import { GMapService } from './gmap-service.service';
import { SiteService } from './service-site.service';
import { NewShapesComponent } from './new-shapes/new-shapes.component';




@NgModule({
  declarations: [
    AppComponent,GoogleMapComponentComponent, NewShapesComponent, BuildingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
	RoutingModule
	
  ],
  providers: [GMapService,SiteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
