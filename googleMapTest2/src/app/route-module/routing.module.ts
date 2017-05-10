import { NgModule} from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AppComponent} from '../app.component';
import {BuildingComponent} from  '../building-component/building-component.component';
import {NewShapesComponent} from '../new-shapes/new-shapes.component';
import {ObjectComponent} from '../object-component/object.component';
import {ObjectDetailComponent} from '../object-detail/object-detail.component';
import {TagComponent} from '../tag/tag.component';



export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
 // { path: 'home',  component: DashboardComponent },
  { path: 'building/:id', component: BuildingComponent },
  { path: 'home',  component: AppComponent },
  { path: 'newPolygon',  component: NewShapesComponent },
  { path: 'object/:siteId',  component: ObjectComponent },
  { path: 'objects',  component: ObjectComponent },
  { path: 'object/details/:objectId',  component: ObjectDetailComponent },
  { path: 'tag',  component: TagComponent },
];


@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})


export class RoutingModule {}
