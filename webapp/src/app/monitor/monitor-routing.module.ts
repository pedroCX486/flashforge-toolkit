import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorScreenComponent } from './monitorscreen/monitorscreen.component';


const routes: Routes = [
  {
    path: '',
    component: MonitorScreenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MonitorRoutingModule { }
