import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';


@Component({
  selector: 'app-monitorscreen',
  templateUrl: './monitorscreen.component.html',
  styleUrls: ['./monitorscreen.component.scss']
})
export class MonitorScreenComponent implements OnInit {

  constructor(private http: HttpClient) { }

  baseURL = environment.apiUrl + ':' + environment.apiPort;
  printerAddr = environment.printerAddr;

  // Status List
  // 0 = Connection Status
  // 1 = Printer Status
  // 2 = Print Progress
  // 3 = Nozzle Temperature

  connectionStatus: any;
  printerData = [{ status: '' }];
  printerStatusList = ['MachineStatus: READY', 'MachineStatus: BUILDING_FROM_SD'];
  printerStatus = '';
  printProgress = 0;
  nozzleTemperature = '';

  ngOnInit(): void {
    this.getPrinterData();

    setInterval(() => {
      this.getPrinterData();
    }, 10 * 1000);
  }

  getPrinterData(): void {
    this.connectionStatus = this.connectionStatus ? 'Fetching...' : 'Connecting...';
    this.fetchData(this.baseURL + '/flashforge/requestData').toPromise().then((data: any) => {
      this.printerData = data;
      this.parseData();
    }).catch(() => {
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
      this.connectionStatus = 'Printer offline. (No Response)';
    }
  }

  fetchData(url: string): Observable<any> {
    return this.http.get(url);
  }
}
