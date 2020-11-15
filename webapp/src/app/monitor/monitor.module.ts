import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MonitorRoutingModule } from './monitor-routing.module';
import { MonitorScreenComponent } from './monitorscreen.component';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';

@NgModule({
  declarations: [MonitorScreenComponent],
  imports: [
    CommonModule,
    MonitorRoutingModule,
    ProgressbarModule.forRoot()
  ]
})
export class MonitorModule { }
