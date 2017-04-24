import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AppComponent} from '../app.component';
import {BuildingComponent} from  '../building-component/building-component.component';
import { NewShapesComponent }from '../new-shapes/new-shapes.component';



export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
 // { path: 'home',  component: DashboardComponent },
  { path: 'building/:id', component: BuildingComponent },
  { path: 'home',  component: AppComponent },
  { path: 'newPolygon',  component: NewShapesComponent }

];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})


export class RoutingModule {}
