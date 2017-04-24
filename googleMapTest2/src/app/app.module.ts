import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { GoogleMapComponentComponent } from './google-map-component/google-map-component.component';

import { GMapService } from './gmap-service.service';
import { SiteService } from './service-site.service';

@NgModule({
  declarations: [
    AppComponent,GoogleMapComponentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
	
  ],
  providers: [GMapService,SiteService],
  bootstrap: [AppComponent]
})
export class AppModule { }
