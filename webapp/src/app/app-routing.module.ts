import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MonitorScreenComponent } from './monitor/monitorscreen.component';


const routes: Routes = [{
  path: '',
  component: MonitorScreenComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
