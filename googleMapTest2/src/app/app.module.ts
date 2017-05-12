import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import {RoutingModule} from './route-module/routing.module';

//* Pop-up __ Modal *//
import { NguiPopupModule } from '@ngui/popup';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';


import { AppComponent } from './app.component';
import { GoogleMapComponentComponent } from './google-map-component/google-map-component.component';
import {BuildingComponent} from './building-component/building-component.component';
import { NewShapesComponent } from './new-shapes/new-shapes.component';
import { RootComponent } from './root.component';
import { ObjectComponent } from './object-component/object.component';
import { ObjectDetailComponent } from './object-detail/object-detail.component';
import { TagComponent } from './tag/tag.component';

import {BuildingService} from './building.service';
import {GMapService} from './gmap-service.service';
import {SiteService} from './service-site.service';
import {FloorService} from './floor.service';
import {SpaceService} from './space.service';
import {ReaderService} from './reader.service';
import {ObjetService} from'./objet.service';
import {TagService} from'./tag.service';

import {OrderByPipe,CategoryPipe} from './custom-pipe';

@NgModule({
  declarations: [
    AppComponent,GoogleMapComponentComponent, NewShapesComponent, BuildingComponent, RootComponent, ObjectComponent, ObjectDetailComponent, TagComponent,OrderByPipe,CategoryPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
	RoutingModule,
	NguiPopupModule,
	Ng2Bs3ModalModule,	
  ],
  providers: [GMapService,SiteService,BuildingService,SpaceService,FloorService,ReaderService,ObjetService,TagService],
  bootstrap: [RootComponent]
})
export class AppModule { }
