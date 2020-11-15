import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { environment } from '@env/environment';


const routes: Routes = [];

if (environment.enableLogin) {
  routes.push({
    path: '',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
    {
      path: 'monitor',
      loadChildren: () => import('./monitor/monitor.module').then(m => m.MonitorModule)
    });
} else {
  routes.push({
    path: '',
    loadChildren: () => import('./monitor/monitor.module').then(m => m.MonitorModule)
  });
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
