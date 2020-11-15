import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';


@Component({
  selector: 'app-monitorscreen',
  templateUrl: './monitorscreen.component.html',
  styleUrls: ['./monitorscreen.component.scss']
})
export class MonitorScreenComponent implements OnInit {

  constructor(private http: HttpClient, private router: Router) { }

  baseURL = environment.apiUrl + ':' + environment.apiPort;
  printerAddr = environment.printerAddr;
  authorization: boolean;
  isLoginEnabled = environment.enableLogin;

  // Status List
  // 0 = Connection Status
  // 1 = Printer Status
  // 2 = Print Progress
  // 3 = Nozzle Temperature

  connectionStatus: any;
  printerData = [{ status: '' }];
  printerStatusList = ['MachineStatus: READY', 'MachineStatus: BUILDING_FROM_SD'];
  printerStatus = '...';
  printProgress = 0;
  nozzleTemperature = '...';

  ngOnInit(): void {
    if (!localStorage.getItem('login') && this.isLoginEnabled) {
      this.router.navigateByUrl('/');
      return;
    } else {
      this.authorization = true;
    }

    this.getPrinterData();

    setInterval(() => {
      this.getPrinterData();
    }, 10 * 1000);
  }

  getPrinterData(): void {
    this.connectionStatus = this.connectionStatus ? 'Updating status...' : 'Connecting...';
    this.getJSON(this.baseURL + '/flashforge/requestData').toPromise().then(t => {
      this.printerData = t as any;
      this.parseData();
    }).then().catch(t => {
      this.printerData[0].status = '';
      this.parseData();
    });
  }

  parseData(): void {
    if (this.printerData[0].status) {
      this.connectionStatus = this.printerData[0].status.includes('Success') ? 'Connected' : 'Unknown connection error.';
      this.printerStatus = this.printerData[1].status.includes(this.printerStatusList[0]) ?
        'Idle/Ready' : this.printerData[1].status.includes(this.printerStatusList[1]) ? 'Printing' : 'Unknown Status';
      this.printProgress = this.printerData[2].status ? Number(this.printerData[2].status.split('byte ')[1].split('/')[0]) : 0;
      this.nozzleTemperature = this.printerData[3].status ?
        this.printerData[3].status.split(' ')[1].replace('T0:', '') + 'ºC' : 'Unknown Temperature';
    } else {
      this.connectionStatus = 'Printer offline.';
    }
  }

  logout(): void {
    if (!!localStorage.getItem('login')) {
      localStorage.removeItem('login');
      this.router.navigate(['/'], { skipLocationChange: true });
    }
  }

  getJSON(arg: string): Observable<any> {
    return this.http.get(arg);
  }
}
